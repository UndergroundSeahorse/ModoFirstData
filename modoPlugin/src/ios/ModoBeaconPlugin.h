//
//  ModoPlugin.h
//  ModoPlugin
//
//  Created by Bion Oren on 3/13/15.
//
//

#import <Cordova/CDV.h>

@interface ModoBeaconPlugin : CDVPlugin

/**
 * @param string baseUrl - eg. https://demo.modopayments.com/beacon_service/api/
 * @return null|string - error message
 */
-(void)setup:(CDVInvokedUrlCommand*)command;
/**
 * @param float latitude
 * @param float longitude
 * @return null|string - error message
 */
-(void)setLocation:(CDVInvokedUrlCommand*)command;
/**
 * @return dictionary|string - error message, or a dictionary of "area"=area ID, "x", "y"
 */
-(void)startScan:(CDVInvokedUrlCommand*)command;
/**
 * @return null|string - error message
 */
-(void)stopScan:(CDVInvokedUrlCommand*)command;
/**
 * @return null|string - error message
 */
-(void)startBroadcast:(CDVInvokedUrlCommand*)command;
/**
 * @return null|string - error message
 */
-(void)stopBroadcast:(CDVInvokedUrlCommand*)command;

/**
 * @return int|string - error message
 */
-(void)getRequestTimeout:(CDVInvokedUrlCommand*)command;
/**
 * @param int timeout Must be greater than or equal to 0
 * @return int|string - error message
 */
-(void)setRequestTimeout:(CDVInvokedUrlCommand*)command;
/**
 * @return float|string - error message
 */
-(void)getNavigationThreshold:(CDVInvokedUrlCommand*)command;
/**
 * @param float threshold Must be between 0 and 1
 * @return float|string - error message
 */
-(void)setNavigationThreshold:(CDVInvokedUrlCommand*)command;
/**
 * @return bool|string - error message
 */
-(void)isInitialized:(CDVInvokedUrlCommand*)command;
/**
 * @return string - error message, or image data in the form "data:image/png;base64,..."
 */
-(void)getMapImage:(CDVInvokedUrlCommand*)command;
/**
 * @return string - error message, or the ID of the map
 */
-(void)getMapId:(CDVInvokedUrlCommand*)command;
/**
 * @return string - error message, or the name of the map
 */
-(void)getMapName:(CDVInvokedUrlCommand*)command;

@end