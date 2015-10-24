//
//  ModoPlugin.h
//  ModoPlugin
//
//  Created by Bion Oren on 3/13/15.
//
//

#import <Cordova/CDV.h>

@interface ModoPlugin : CDVPlugin

/**
 * @param string baseUrl - eg. https://api.gomo.do/valhalla/api_v2.php/
 * @param string appId - eg. 7A11BB5D239745CDA5B3BFA90F8507CF
 * @param string smsPrefix - (optional) Message to send in the registration SMS (if SMS registration is used). Up to 115 characters (automatically truncated)
 * @return null|string - error message
 */
-(void)setup:(CDVInvokedUrlCommand*)command;
/**
 * @param string publicKey
 * @return string|dictionary - error string, or dict of encryptedData, redactedCardNumber, cardType
 */
-(void)getCreditCardData:(CDVInvokedUrlCommand*)command;
/**
 * @param string phoneNumber
 * @param string email
 * @param string firstName
 * @param string lastName
 * @param string pinCode
 * @return null|string - null on success, "SMS" if you should try SMS registration, or an error string
 */
-(void)registerUser:(CDVInvokedUrlCommand*)command;
/**
 * @param string pin
 * @return null|string - null on success, or an error string
 */
-(void)setPin:(CDVInvokedUrlCommand*)command;
/**
 * @param string pin
 * @return null|string|dictionary - token string on success, null or a debug string on error
 */
-(void)unlockWithPin:(CDVInvokedUrlCommand*)command;
/**
 * @param string message Message to show the user telling them why you're asking for touch ID
 * @return null|string|dictionary - token string on success, null or a debug string on error
 */
-(void)unlockWithTouchId:(CDVInvokedUrlCommand*)command;
/**
 * @return null
 */
-(void)lock:(CDVInvokedUrlCommand*)command;
/**
 * @return null
 */
-(void)resetSecurity:(CDVInvokedUrlCommand*)command;
/**
 * @param int|float timeout
 * @return null
 */
-(void)setRequestTimeout:(CDVInvokedUrlCommand*)command;
/**
 * @return null|string Token string (if one exists from a prior registration or unlock call)
 */
-(void)getApiToken:(CDVInvokedUrlCommand*)command;

@end