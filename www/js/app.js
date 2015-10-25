// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var ref = new Firebase('https://nopay.firebaseio.com/');

angular.module('starter', [
  'ionic', 
  'starter.controllers', 
  'starter.services',
  'ngCordovaBeacon',
  'braintree-angular'
  ])

// .constant('clientTokenPath', 'http://10.101.1.179:1212/client_token')
.constant('clientTokenPath', 'http://5703b7e7.ngrok.io:1212/client_token')

.run(function($ionicPlatform, $rootScope, $http, $cordovaBeacon, $log, User) {

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }

    // $rootScope.searchBeacons = function() {
    // 
      // search for beacon
      $cordovaBeacon.requestWhenInUseAuthorization();
      $cordovaBeacon.startRangingBeaconsInRegion($cordovaBeacon.createBeaconRegion("MODO", "61482E47-FBE1-9D72-0F0F-0F0F0F0F0F0F"));
    // }

    $rootScope.$on("$cordovaBeacon:didRangeBeaconsInRegion", function(event, pluginResult) {
      
      if (pluginResult.beacons.length > 0) {

        var payload = {
          beacons: pluginResult.beacons,
          user: User.get()
        };
        
        $http.post('http://5703b7e7.ngrok.io/parseBeaconData', payload);
        $cordovaBeacon.stopRangingBeaconsInRegion($cordovaBeacon.createBeaconRegion("MODO", "61482E47-FBE1-9D72-0F0F-0F0F0F0F0F0F"));

      }
    });

    // Look for beacons
    // $cordovaBeacon.requestWhenInUseAuthorization();
 
    // $rootScope.$on("$cordovaBeacon:didStartMonitoringForRegion", function(event, pluginResult) {  
    //   // store beacons on client?
    //   Beacons.clearBeacons();
    //   var uniqueBeaconKey;
    //   for(var i = 0; i < pluginResult.beacons.length; i++) {
    //       uniqueBeaconKey = pluginResult.beacons[i].uuid + ":" + pluginResult.beacons[i].major + ":" + pluginResult.beacons[i].minor;
    //       Beacons.beacons[uniqueBeaconKey] = pluginResult.beacons[i];
    //   }

    //   var payload = {
    //     beacons: pluginResult.beacons,
    //     user: User
    //   };

    //   console.log('inside event');

    //   // send beacon list to server
    //   $http.post('http://10.101.1.179:1212/parseBeaconData', payload)
    //     .then(function(resp) {
    //       // callback for success
    //     },
    //     function(err) {
    //       // callback for error 
    //       console.error("there was an error sending the data", err);
    //     });
    //   $rootScope.$apply();
    // });
 

    // console.log('OUTSIDE event');


    // // start by ranging beacons
    // $cordovaBeacon.startMonitoringForRegion(Beacons.getTargetBeacon());
    // // mock data
    // // $rootScope.$broadcast('$cordovaBeacon:didStartMonitoringForRegion', 
    // // {beacons: [{
    // //     "minor":4,
    // //     "rssi":-71,
    // //     "major":0,
    // //     "proximity":"ProximityFar",
    // //     "accuracy":1.42,
    // //     "uuid":"61482E47-FBE1-9D72-0F0F-0F0F0F0F0F0F"
    // //   }]
    // // });

  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('splash', {
    url: '/splash',
    templateUrl: 'templates/splash.html',
    controller: 'SplashCtrl'
  })

  // setup an abstract state for the tabs directive
  .state('customer', {
    url: '/customer',
    abstract: true,
    templateUrl: 'templates/customer.html'
  })

  // setup an abstract state for the tabs directive
  .state('customer.home', {
    url: '/home',
    views: {
      'customer-home': {
        templateUrl: 'templates/customer-home.html',
        controller: 'CustHomeCtrl'
      }
    }
  })

  .state('customer.payments', {
    url: '/payments',
    views: {
      'customer-payments': {
        templateUrl: 'templates/customer-payments.html',
        controller: 'CustPayCtrl'
      }
    }
  })

  .state('restaurant', {
    url: '/restaurant',
    abstract: true,
    templateUrl: 'templates/restaurant.html'
  })

  .state('restaurant.home', {
    url: '/home',
    views: {
      'restaurant-home': {
        templateUrl: 'templates/restaurant-home.html',
        controller: 'RestHomeCtrl'
      }
    }
  })

  .state('customerdetail', {
    url: '/customers/:customerId',
    templateUrl: 'templates/customer-detail.html',
    controller: 'CustomerCtrl'
  })

  .state('monitor', {
    url: '/monitor',
    templateUrl: 'templates/monitor.html',
    controller: 'Monitor'
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/splash');

});
