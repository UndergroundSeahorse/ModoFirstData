#import "ModoBeaconPlugin.h"
#import <ModoKit/ModoKit.h>
#import <CoreLocation/CoreLocation.h>

@interface ModoBeaconPlugin () <MKBeaconDelegate>

@property (nonatomic, strong) NSString* setLocationCommandId;
@property (nonatomic, strong) NSString* startScanCommandId;

@property (nonatomic, strong) MKBeacon* beaconManager;
@property (nonatomic, assign) BOOL locationSet;

-(void)modoBeacon:(MKBeacon*)beacon locationLoadedWithError:(NSError*)error;
-(void)modoBeacon:(MKBeacon*)beacon movedToArea:(int)areaId x:(int)x y:(int)y; //every time we get a "valid solution", we call this
-(void)modoBeacon:(MKBeacon*)beacon spotUpdate:(int)spotId prox:(CLProximity)proximity; //anytime we find a proximity beacon

@end

@implementation ModoBeaconPlugin

-(BOOL)isLocationSetupForCommand:(CDVInvokedUrlCommand*)command {
    if(!self.beaconManager) {
        CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Did you forget to call setup first?"];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        return NO;
    }
    
    if(!self.locationSet) {
        CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Did you forget to call setLocation first? Did it complete successfully?"];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        return NO;
    }
    
    return YES;
}

-(void)setup:(CDVInvokedUrlCommand*)command {
    NSString* baseUrl = command.arguments[0];
    if(!baseUrl) {
        CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Missing required parameter baseUrl"];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        return;
    }
    
    self.beaconManager = [[MKBeacon alloc] initWithBaseUrl:baseUrl];
    self.beaconManager.delegate = self;
    
    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

-(void)setLocation:(CDVInvokedUrlCommand*)command {
    if(!self.beaconManager) {
        CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Did you forget to call setup first?"];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        return;
    }
    
    NSNumber* latitude = command.arguments[0];
    NSNumber* longitude = command.arguments[1];
    if(!latitude || !longitude) {
        CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Missing required parameter latitude and/or longitude"];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        return;
    }
    
    self.startScanCommandId = nil;
    self.setLocationCommandId = command.callbackId;
    CLLocationCoordinate2D coordinate = CLLocationCoordinate2DMake(latitude.doubleValue, longitude.doubleValue);
    [self.beaconManager setLocationWithLatLong:coordinate];
}

-(void)startScan:(CDVInvokedUrlCommand*)command {
    if(![self isLocationSetupForCommand:command]) {
        return;
    }
    
    self.startScanCommandId = command.callbackId;
    [self.beaconManager startScan];
}

-(void)stopScan:(CDVInvokedUrlCommand*)command {
    if(![self isLocationSetupForCommand:command]) {
        return;
    }
    
    [self.beaconManager stopScan];
    self.startScanCommandId = nil;
    
    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

-(void)startBroadcast:(CDVInvokedUrlCommand*)command {
    if(![self isLocationSetupForCommand:command]) {
        return;
    }
    
    [self.beaconManager startBroadcast];
    
    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

-(void)stopBroadcast:(CDVInvokedUrlCommand*)command {
    if(![self isLocationSetupForCommand:command]) {
        return;
    }
    
    [self.beaconManager stopBroadcast];
    
    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

#pragma mark - Properties

-(void)getRequestTimeout:(CDVInvokedUrlCommand*)command {
    if(!self.beaconManager) {
        CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Did you forget to call setup first?"];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        return;
    }
    
    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsInt:(int)self.beaconManager.requestTimeout];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

-(void)setRequestTimeout:(CDVInvokedUrlCommand*)command {
    if(!self.beaconManager) {
        CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Did you forget to call setup first?"];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        return;
    }
    
    NSNumber* timeout = command.arguments[0];
    if(!timeout) {
        CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Missing required parameter timeout"];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        return;
    }
    
    self.beaconManager.requestTimeout = timeout.unsignedIntegerValue;
    
    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

-(void)getNavigationThreshold:(CDVInvokedUrlCommand*)command {
    if(!self.beaconManager) {
        CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Did you forget to call setup first?"];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        return;
    }
    
    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDouble:self.beaconManager.navigationThreshold.doubleValue];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

-(void)setNavigationThreshold:(CDVInvokedUrlCommand*)command {
    if(!self.beaconManager) {
        CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Did you forget to call setup first?"];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        return;
    }
    
    NSNumber* threshold = command.arguments[0];
    if(!threshold) {
        CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Missing required parameter threshold"];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        return;
    }
    
    self.beaconManager.navigationThreshold = threshold;
    
    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

-(void)isInitialized:(CDVInvokedUrlCommand*)command {
    if(!self.beaconManager) {
        CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Did you forget to call setup first?"];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        return;
    }
    
    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:self.beaconManager.isInitialized];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

-(void)getMapImage:(CDVInvokedUrlCommand*)command {
    if(![self isLocationSetupForCommand:command]) {
        return;
    }
    
    NSString* imageData = [NSString stringWithFormat:@"data:image/png;base64,%@", [UIImagePNGRepresentation(self.beaconManager.mapImage) base64EncodedStringWithOptions:0]];
    
    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:imageData];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

-(void)getMapId:(CDVInvokedUrlCommand*)command {
    if(![self isLocationSetupForCommand:command]) {
        return;
    }
    
    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:self.beaconManager.mapId];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

-(void)getMapName:(CDVInvokedUrlCommand*)command {
    if(![self isLocationSetupForCommand:command]) {
        return;
    }
    
    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:self.beaconManager.mapName];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

#pragma mark - MKBeaconDelegate

-(void)modoBeacon:(MKBeacon*)beacon locationLoadedWithError:(NSError*)error {
    CDVPluginResult* result;
    if(error) {
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:[NSString stringWithFormat:@"%@", error]];
    } else {
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
        self.locationSet = YES;
    }
    
    [self.commandDelegate sendPluginResult:result callbackId:self.setLocationCommandId];
    self.setLocationCommandId = nil;
}

-(void)modoBeacon:(MKBeacon*)beacon movedToArea:(int)areaId x:(int)x y:(int)y {
    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:@{@"area":@(areaId), @"x":@(x), @"y": @(y)}];
    [result setKeepCallbackAsBool:YES];
    [self.commandDelegate sendPluginResult:result callbackId:self.startScanCommandId];
}

-(void)modoBeacon:(MKBeacon*)beacon spotUpdate:(int)spotId prox:(CLProximity)proximity {
}

@end