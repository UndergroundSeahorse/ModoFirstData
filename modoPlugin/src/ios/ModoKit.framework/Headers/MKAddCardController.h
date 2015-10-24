 //
//  MKAddCard.h
//  ModoKit
//
//  Created by Bion Oren on 3/2/15.
//  Copyright (c) 2015 ModoPayments. All rights reserved.
//

@import UIKit;

@class MKAddCardController;

/**
 * Provides feedback about card registration events
 */
@protocol MKAddCardControllerDelegate<NSObject>

/**
 * Card registration completed successfully
 *
 * @param controller The instance of MKAddCardController that is calling your delegate
 * @param cardData Encrypted card data that you should send to your app server (which will then send it to Modo)
 * @param number String of the form number	••••••••••••9990
 * @param type Card type (Visa, Mastercard, etc)
 */
-(void)userDidCompleteCardRegistration:(MKAddCardController* __nonnull)controller withEncryptedData:(NSString* __nonnull)cardData redactedCardNumber:(NSString* __nonnull)number cardType:(NSString* __nonnull)type;
/**
 * The user cancelled card registration
 *
 * The registration controller has been dismissed. If you wish to try again, you must start over with a new instance of MKAddCardController
 * It's possible that removing the controller's view from the view hierarchy and re-adding it will also trigger card registration, but you
 * should not rely on this behavior.
 *
 * @param controller The instance of MKAddCardController that is calling your delegate
 */
-(void)userDidCancelCardRegistration:(MKAddCardController* __nonnull)controller;

@end

/**
 * Provides the public encryption key from Modo for card encryption
 */
@protocol MKAddCardControllerDataSource<NSObject>

/**
 * @param controller The instance of MKAddCardController that is calling your data source
 * @return The public encryption key from Modo's public key API, exactly how Modo returned it
 */
-(NSString* __nonnull)publicKeyForController:(MKAddCardController* __nonnull)controller;

@end

/**
 * Enables users to add credit cards in a PCI compliant manner
 *
 * Adding this controller to your view hierarchy will present screens allowing a user to take a picture of their credit card or manually enter
 * their card information. This information will then be encrypted using the public key from your data source and provided (along with some
 * other information) to your data source, so that you can send the encrypted card information to the Modo platform.
 */
@interface MKAddCardController : UIViewController

-(id __nullable)init __attribute__((unavailable("Must use initWithDelegate: instead.")));
-(id __nonnull)initWithNibName:(NSString* __nullable)nibNameOrNil bundle:(NSBundle* __nullable)nibBundleOrNil __attribute__((unavailable("Must use initWithDelegate: instead.")));
/**
 * Setup the controller
 *
 * After initing the controller, you will need to present it. You are also responsible for dismissing it after your delegate is called.
 *
 * @param delegate
 * @param dataSource
 */
-(id __nullable)initWithDelegate:(id<MKAddCardControllerDelegate> __nonnull)delegate dataSource:(id<MKAddCardControllerDataSource> __nonnull)dataSource;

@end