//
//  MKUserAuthentication.h
//  ModoKit
//
//  Created by Bion Oren on 3/6/15.
//  Copyright (c) 2015 ModoPayments. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <MessageUI/MessageUI.h>

@class MKUserAuthentication;

typedef NS_ENUM(NSUInteger, REGISTRATION_STATUS) {
    REGISTRATION_STATUS_OK, // Registration succeeded
    REGISTRATION_STATUS_FAILED, // Registration failed
    REGISTRATION_STATUS_TRY_SMS, // Something went wrong during verification, so we're trying SMS. Have the user provide the SMS code we just sent, and then try to continue registration with registerPhoneNumberWithSmsCode:
    REGISTRATION_STATUS_SMS_SENT, // SMS sent successfully
    REGISTRATION_STATUS_SMS_FAILED, // The SMS could not be validated
};

@protocol MKUserAuthenticationDelegate <NSObject>

-(void)userAuthentication:(MKUserAuthentication* __nonnull)authController didCompleteRegistrationWithResult:(REGISTRATION_STATUS)result;
-(void)userAuthentication:(MKUserAuthentication* __nonnull)authController didAuthenticateWithToken:(NSString* __nullable)token; //token will be nil if authentication failed
-(void)userAuthentication:(MKUserAuthentication* __nonnull)authController didFailAuthenticationWithError:(NSError* __nullable)error;
-(void)userAuthentication:(MKUserAuthentication* __nonnull)authController setPinWithError:(NSError* __nullable)error;

@end

@protocol MKUserAuthenticationDataSource <NSObject>

@optional
-(nonnull NSString*)messageForSmsRegistration;

@end

@interface MKUserAuthentication : NSObject

@property (nonatomic) BOOL unlocked; //set to NO to lock the app (also clears apiToken)
@property (nonatomic, weak) id<MKUserAuthenticationDelegate> __nullable delegate;
@property (nonatomic, weak) id<MKUserAuthenticationDataSource> __nullable dataSource;
@property (nonatomic) NSUInteger requestTimeout; //default 15 seconds. Note that some operations contain multiple requests

@property (nonatomic) MFMessageComposeViewController* __nullable smsController;


-(id __nullable)init __attribute__((unavailable("Must use initWithBaseUrl: instead.")));
//example url: https://services.gomo.do/valhalla/api_v2.php/
-(id __nullable)initWithBaseUrl:(NSString* __nonnull)url appId:(NSString* __nonnull)appId;

-(void)registerPhoneNumber:(NSString* __nonnull)phoneNumber email:(NSString* __nonnull)email firstName:(NSString* __nonnull)first lastName:(NSString* __nonnull)last pinCode:(NSString* __nonnull)pin; //you should also expect a callback to userAuthentication:didAuthenticateWithToken: if registration is successful (after the callback to userAuthentication:didCompleteRegistrationWithResult:)

-(void)setPin:(NSString* __nonnull)pin;
-(void)unlockWithPin:(NSString* __nonnull)pin; //calls userAuthentication:didFailAuthenticationWithError: with a nil error on success, an error on failure. You can also check the unlocked property to see if the keys are unlocked
-(void)unlockViaTouchIdWithMessage:(NSString* __nonnull)message; //calls userAuthentication:didFailAuthenticationWithError: with a nil error on success, an error on failure. You can also check the unlocked property to see if the keys are unlocked
-(void)getToken; //returns API token via delegate on success

-(BOOL)reset; //resets all registration and identity information. loginWithPin: will always return NO until the user successfully completes registration again.

@end