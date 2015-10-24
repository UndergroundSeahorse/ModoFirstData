#import "ModoPlugin.h"
#import <ModoKit/ModoKit.h>

@interface ModoPlugin () <MKAddCardControllerDelegate, MKAddCardControllerDataSource, MKUserAuthenticationDelegate, MKUserAuthenticationDataSource>

@property (nonatomic, strong) NSString* getCreditCardDataCommandId;
@property (nonatomic, strong) NSString* registerUserCommandId;
@property (nonatomic, strong) NSString* unlockWithPinCommandId;
@property (nonatomic, strong) NSString* getTokenCommandId;

@property (nonatomic, strong) MKAddCardController* cardController;
@property (nonatomic, strong) MKUserAuthentication* authManager;

@property (nonatomic, strong) NSString* publicKey;
@property (nonatomic, strong) NSString* smsPrefix;

-(void)userDidCancelCardRegistration:(MKAddCardController*)controller;
-(void)userDidCompleteCardRegistration:(MKAddCardController*)controller withEncryptedData:(NSString*)cardData redactedCardNumber:(NSString*)number cardType:(NSString*)type;
-(NSString*)publicKeyForController:(MKAddCardController*)controller;
-(void)userAuthentication:(MKUserAuthentication*)authController didCompleteRegistrationWithResult:(REGISTRATION_STATUS)result;
-(void)userAuthentication:(MKUserAuthentication*)authController didAuthenticateWithToken:(NSString*)token;
-(void)userAuthentication:(MKUserAuthentication *)authController didFailAuthenticationWithError:(NSError*)error;
-(void)userAuthentication:(MKUserAuthentication*)authController setPinWithError:(NSError *)error;

@end

@implementation ModoPlugin

-(void)setup:(CDVInvokedUrlCommand*)command {
    NSString* baseUrl = command.arguments[0];
    NSString* appId = command.arguments[1];
    if(command.arguments.count > 2) {
        self.smsPrefix = command.arguments[2];
    } else {
        self.smsPrefix = @"";
    }
    
    if(!baseUrl) {
        CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Missing required parameter baseUrl"];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        return;
    }
    if(!appId) {
        CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Missing required parameter appId"];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        return;
    }
    
    self.authManager = [[MKUserAuthentication alloc] initWithBaseUrl:baseUrl appId:appId];
    self.authManager.delegate = self;
    self.authManager.dataSource = self;
    self.authManager.requestTimeout = 5;
    
    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

-(void)getCreditCardData:(CDVInvokedUrlCommand*)command {
    self.publicKey = command.arguments[0];
    if(!self.publicKey) {
        CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Missing required parameter publicKey"];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        return;
    }
    
    self.getCreditCardDataCommandId = command.callbackId;
    self.cardController = [[MKAddCardController alloc] initWithDelegate:self dataSource:self];
    [self.viewController presentViewController:self.cardController animated:YES completion:nil];
}

-(void)registerUser:(CDVInvokedUrlCommand*)command {
    if(!self.authManager) {
        CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Did you forget to call setup first?"];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        return;
    }
    
    NSString* phoneNumber = command.arguments[0];
    NSString* email = command.arguments[1];
    NSString* firstName = command.arguments[2];
    NSString* lastName = command.arguments[3];
    NSString* pinCode = command.arguments[4];
    if(!phoneNumber || !email || !firstName || !lastName || !pinCode) {
        CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Missing one or more required parameters"];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        return;
    }
    
    self.registerUserCommandId = command.callbackId;
    [self.authManager registerPhoneNumber:phoneNumber email:email firstName:firstName lastName:lastName pinCode:pinCode];
}

-(void)setPin:(CDVInvokedUrlCommand*)command {
    if(!self.authManager) {
        CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Did you forget to call setup first?"];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        return;
    }
    
    NSString* pin = command.arguments[0];
    if(!pin) {
        CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Missing required parameter pin"];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        return;
    }
    
    self.registerUserCommandId = command.callbackId;
    self.authManager.pin = pin;
}

-(void)unlockWithPin:(CDVInvokedUrlCommand*)command {
    if(!self.authManager) {
        CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Did you forget to call setup first?"];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        return;
    }
    
    NSString* pin = command.arguments[0];
    if(!pin) {
        CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Missing required parameter pin"];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        return;
    }
    
    self.unlockWithPinCommandId = command.callbackId;
    [self.authManager unlockWithPin:pin];
}

-(void)unlockWithTouchId:(CDVInvokedUrlCommand*)command {
    if(!self.authManager) {
        CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Did you forget to call setup first?"];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        return;
    }
    
    NSString* message = command.arguments[0];
    if(!message) {
        CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Missing required parameter message"];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        return;
    }
    
#warning Hijacking the unlockWithPinCommandId
    self.unlockWithPinCommandId = command.callbackId;
    [self.authManager unlockViaTouchIdWithMessage:message];
}

-(void)lock:(CDVInvokedUrlCommand*)command {
    if(!self.authManager) {
        CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Did you forget to call setup first?"];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        return;
    }
    
    self.authManager.unlocked = NO;
    [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK] callbackId:command.callbackId];
}

-(void)resetSecurity:(CDVInvokedUrlCommand*)command {
    if(!self.authManager) {
        CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Did you forget to call setup first?"];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        return;
    }
    
    [self.authManager reset];
    
    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

-(void)setRequestTimeout:(CDVInvokedUrlCommand*)command {
    if(!self.authManager) {
        CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Did you forget to call setup first?"];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        return;
    }
    
    self.authManager.requestTimeout = [command.arguments[0] intValue];
    
    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

-(void)getApiToken:(CDVInvokedUrlCommand*)command {
    if(!self.authManager) {
        CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Did you forget to call setup first?"];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        return;
    }
    
    self.getTokenCommandId = command.callbackId;
    [self.authManager getToken];
}

#pragma mark - MKAddCardControllerDelegate

-(void)userDidCancelCardRegistration:(MKAddCardController*)controller {
    [controller dismissViewControllerAnimated:YES completion:^{
        CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"User canceled card registration"];
        [self.commandDelegate sendPluginResult:result callbackId:self.getCreditCardDataCommandId];
        self.getCreditCardDataCommandId = nil;
    }];
}

-(void)userDidCompleteCardRegistration:(MKAddCardController*)controller withEncryptedData:(NSString*)cardData redactedCardNumber:(NSString*)number cardType:(NSString*)type {
    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:@{@"encryptedData":cardData, @"redactedCardNumber":number, @"cardType":type}];
    [self.commandDelegate sendPluginResult:result callbackId:self.getCreditCardDataCommandId];
    self.getCreditCardDataCommandId = nil;
    dispatch_async(dispatch_get_main_queue(), ^{
        [controller dismissViewControllerAnimated:YES completion:nil];
    });
}

#pragma mark - MKAddCardControllerDataSource

-(NSString*)publicKeyForController:(MKAddCardController*)controller {
    return self.publicKey;
}

#pragma mark - MKUserAuthenticationDelegate

-(void)userAuthentication:(MKUserAuthentication*)authController didCompleteRegistrationWithResult:(REGISTRATION_STATUS)status {
    static NSArray<NSString*>* _Nullable recipients;
    static NSString* _Nullable message;
    
    CDVPluginResult* result;
    switch(status) {
        case REGISTRATION_STATUS_TRY_SMS:
        {
#ifdef DEBUG
            if(!authController.smsController) {
                break;
            }
#endif
            if(authController.smsController.presentingViewController) {
                dispatch_async(dispatch_get_main_queue(), ^{
                    [authController.smsController dismissViewControllerAnimated:YES completion:^{
                        authController.smsController = [[MFMessageComposeViewController alloc] init];
                        authController.smsController.messageComposeDelegate = (id<MFMessageComposeViewControllerDelegate>)authController;
                        authController.smsController.recipients = recipients;
                        authController.smsController.body = message;
                        [self.viewController presentViewController:authController.smsController animated:true completion:NULL];
                    }];
                });
            } else {
                recipients = authController.smsController.recipients;
                message = authController.smsController.body;
                dispatch_async(dispatch_get_main_queue(), ^{
                    [self.viewController presentViewController:authController.smsController animated:true completion:NULL];
                });
            }
            break;
        }
        case REGISTRATION_STATUS_OK:
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
            [result setKeepCallbackAsBool:YES];
            break;
        case REGISTRATION_STATUS_SMS_SENT:
        {
            dispatch_async(dispatch_get_main_queue(), ^{
                [self.viewController dismissViewControllerAnimated:YES completion:nil];
            });
            break;
        }
        case REGISTRATION_STATUS_FAILED:
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Error in registration"];
            break;
        case REGISTRATION_STATUS_SMS_FAILED:
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Error in registration"];
            break;
    }
    
    if(result) {
        [self.commandDelegate sendPluginResult:result callbackId:self.registerUserCommandId];
        if(![result.keepCallback boolValue]) {
            self.registerUserCommandId = nil;
        }
    }
}

-(void)userAuthentication:(MKUserAuthentication*)authController didAuthenticateWithToken:(NSString*)token {
    CDVPluginResult* result;
    if(token) {
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:token];
    } else {
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR];
        NSLog(@"Additionally, we should have raised an error instead of returning nil here");
    }
    
    if(self.registerUserCommandId) {
        [self.commandDelegate sendPluginResult:result callbackId:self.registerUserCommandId];
    }
    if(self.getTokenCommandId) {
        [self.commandDelegate sendPluginResult:result callbackId:self.getTokenCommandId];
    }
    self.registerUserCommandId = nil;
}

-(void)userAuthentication:(MKUserAuthentication *)authController didFailAuthenticationWithError:(NSError*)error {
    CDVPluginResult* result;
    if(error) {
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:[error localizedDescription]];
    } else {
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    }
    
    if(self.registerUserCommandId) {
        [self.commandDelegate sendPluginResult:result callbackId:self.registerUserCommandId];
    }
    if(self.unlockWithPinCommandId) {
        [self.commandDelegate sendPluginResult:result callbackId:self.unlockWithPinCommandId];
    }
    if(self.getTokenCommandId) {
        [self.commandDelegate sendPluginResult:result callbackId:self.getTokenCommandId];
    }
    self.registerUserCommandId = nil;
    self.unlockWithPinCommandId = nil;
    self.getTokenCommandId = nil;
}

-(void)userAuthentication:(MKUserAuthentication*)authController setPinWithError:(NSError *)error {
    CDVPluginResult* result;
    if(!error) {
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    } else {
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:error.userInfo];
    }
    
    [self.commandDelegate sendPluginResult:result callbackId:self.registerUserCommandId];
    self.registerUserCommandId = nil;
}

#pragma mark - MKUserAuthenticationDataSource

-(NSString*)messageForSmsRegistration {
    return self.smsPrefix;
}

@end