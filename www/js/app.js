// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

var ref = new Firebase('URL');


angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
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
    templateUrl: 'templates/splash.html'
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
        templateUrl: 'templates/customer-home.html'
      }
    }
  })

  .state('customer.payments', {
    url: '/payments',
    views: {
      'customer-payments': {
        templateUrl: 'templates/customer-payments.html'
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
        templateUrl: 'templates/restaurant-home.html'
      }
    }
  })

  .state('restaurant.payments', {
    url: '/payments',
    views: {
      'restaurant-payments': {
        templateUrl: 'templates/restaurant-payments.html'
      }
    }
  })

  .state('restaurant.customers', {
    url: '/customers',
    views: {
      'restaurant-customers': {
        templateUrl: 'templates/restaurant-customers.html'
      }
    }
  })

  .state('restaurant.customer-detail', {
    url: '/customers/:customerId',
    views: {
      'restaurant-customer': {
        templateUrl: 'templates/customer-detail.html'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/splash');

});
