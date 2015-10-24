//
//  MKBeacon.h
//  ModoKitTest
//
//  Created by Michael Menefee on 12/19/14.
//  Copyright (c) 2014 ModoPayments. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <CoreLocation/CoreLocation.h>
#import <UIKit/UIKit.h>

@class MKBeacon;

@protocol MKBeaconDelegate <NSObject>

-(void)modoBeacon:(MKBeacon*)beacon locationLoadedWithError:(NSError*)error;
-(void)modoBeacon:(MKBeacon*)beacon movedToArea:(int)areaId x:(int)x y:(int)y; //every time we get a "valid solution", we call this
-(void)modoBeacon:(MKBeacon*)beacon spotUpdate:(int)spotId prox:(CLProximity)proximity; //anytime we find a proximity beacon
@optional
-(void)modoBeacon:(MKBeacon*)beacon twowayReceived:(int)beaconId; //for future use

@end

@interface MKBeacon : NSObject

@property (nonatomic, weak) id<MKBeaconDelegate> delegate;
@property (nonatomic, assign) NSUInteger requestTimeout; //default 15 seconds
@property (nonatomic, strong) NSNumber* navigationThreshold; //0 to 1. Higher values increase accuracy, but also increase the time to detect changes in region

@property (nonatomic, readonly) BOOL isInitialized;
@property (nonatomic, readonly) UIImage* mapImage;
@property (nonatomic, readonly) NSString* mapId;
@property (nonatomic, readonly) NSString* mapName;
@property (nonatomic, readonly) NSDictionary* areas; //NSValue CGRects keyed by area ID

-(id)init __attribute__((unavailable("Must use initWithBaseUrl: instead.")));
-(id)initWithBaseUrl:(NSString*)url;
-(void)setLocationWithLatLong:(CLLocationCoordinate2D)latlong;
-(BOOL)startScan; //navigation
-(BOOL)stopScan;
-(BOOL)startBroadcast; //connected beacons (advertising) - smart beacon discovers the phone
-(BOOL)stopBroadcast;

@end