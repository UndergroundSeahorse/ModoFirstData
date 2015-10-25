'use strict';

angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})

.controller('CustHomeCtrl', function($scope, $http, User) {
  var restaurant = {
    name: 'Tequeria Cancun',
    menu: [
    {name: 'Encheladas', price: 9.90, checked: false, num: 0},
    {name: 'Super Burrito', price: 11.90, checked: false, num: 0},
    {name: 'Quesadillas', price: 8.90, checked: false, num: 0},
    {name: 'Nachos', price: 6.00, checked: false, num: 0},
    {name: 'Macho Mucho Tacos', price: 12.00, checked: false, num: 0},
    {name: 'California Burrito', price: 15.00, checked: false, num: 0}
    ]
  };

  $scope.sendMockBeaconData = function () {
    var payload = {
      user: User.get(),
      beaconData: {
        major: 1,
        minor: 0
      }
    };

    $http.post('http://5703b7e7.ngrok.io/parseBeaconData', payload);
    $scope.restaurant = restaurant;
  };
})

.controller('CustPayCtrl', function($scope, $braintree, User, $stateParams) {
  console.log('Initialized Cust Pay Ctrl');

  $scope.createCC = createCC;
  var client;
  $scope.creditCard = {
    number: '',
    expirationDate: {}
  };

  var startup = function() {
    $braintree.getClientToken().success(function(token) {
      client = new $braintree.api.Client({
        clientToken: token
      });
    });
  };


  function createCC() {
    // - Validate $scope.creditCard
    // - Make sure client is ready to use
    console.log($scope.creditCard.expirationDate.month + "/" + $scope.creditCard.expirationDate.year.slice(2));
    if($scope.creditCard.number.length === 16 && $scope.creditCard.expirationDate && $scope.creditCard.name && $scope.creditCard.zip && $scope.creditCard.cvv) {
      client.tokenizeCard({
        number: $scope.creditCard.number,
        expirationDate: $scope.creditCard.expirationDate.month + "/" + $scope.creditCard.expirationDate.year.slice(2)
      }, function (err, nonce) {
        if(err) {
          throw new Error(err);
        } else {
          ref.child('user').child(User.user.uid).set(nonce);
          console.log('nonce: ', nonce);
        }
        // - Send nonce to your server (e.g. to make a transaction)
      });
    }
  }
  startup();
})

.controller('RestHomeCtrl', function($scope){

  $scope.customers = [];

  // Keep the customers up to date with Firebase
  ref.child('customers').on('value', function(snapshot) {
    var customers = [];
    var obj = snapshot.val();
    for (var key in obj) {
      customers.push(obj[key]);
    }
    $scope.customers = customers;
    $scope.$apply();
  });
})

.controller('CustomerCtrl', function($scope, $stateParams, $ionicHistory, User, $state, $ionicLoading) {
  $scope.customerId = $stateParams.customerId;
  $scope.name = "Customer";
  var restaurant = {
    name: 'Tequeria Cancun',
    menu: [
    {name: 'Encheladas', price: 9.90, checked: false, num: 0},
    {name: 'Super Burrito', price: 11.90, checked: false, num: 0},
    {name: 'Quesadillas', price: 8.90, checked: false, num: 0},
    {name: 'Nachos', price: 6.00, checked: false, num: 0},
    {name: 'Macho Mucho Tacos', price: 12.00, checked: false, num: 0},
    {name: 'California Burrito', price: 15.00, checked: false, num: 0}
    ]
  };

  $scope.restaurant = {
    name: "Test Restaurant",
    menu: [{name: "Item1", price: 1.00, checked: false, num: 0}, {name: "Item2", price: 2.50, checked: false, num: 0}, {name: "Item3", price: 3.00, checked: false, num: 0}, {name: "Item4", price: 4.50, checked: false, num: 0}, {name: "Item5", price: 5.00, checked: false, num: 0}, {name: "Item6", price: 6.00, checked: false, num: 0}]
  };

  $scope.changeTotal = changeTotal;
  $scope.myGoBack = myGoBack;
  $scope.total = 0;
  $scope.sendBill = sendBill;

  function sendBill(total) {

    var nonce;

    ref.child('user').on('value', function(snapshot) {
      nonce = snapshot.val()[$stateParams.customerId];
      console.log(nonce);
    }, function(err) {
      throw new Error(err);
    });

    $scope.show = function() {
      $ionicLoading.show({
        template: 'Charged $' + total
      });
    };

    $scope.hide = function(){
      $ionicLoading.hide();
    };

    $scope.show();

    setTimeout(function(){
      $state.go('restaurant.home');
      $scope.hide();
    },2000);

    // put on server
    // gateway.transaction.sale({
    //   amount: total,
    //   merchantAccountId: "yourMerchantAccount",
    //   paymentMethodNonce: nonceFromTheClient
    // }, function (err, result) {
    // });
  }

  function myGoBack() {
    $ionicHistory.goBack();
  }

  function changeTotal() {
    $scope.total = 0;
    for(var i=0; i<$scope.restaurant.menu.length; i++) {
      if($scope.restaurant.menu[i].checked) {
        $scope.total += ($scope.restaurant.menu[i].price * $scope.restaurant.menu[i].num);
      }
    }
  }
})

.controller('SplashCtrl', function($scope, $state, User) {
  $scope.buttonChoice = "customer";
  $scope.userType = userType;
  $scope.signIn = signIn;
  $scope.buttonChoiceCu = buttonChoiceCu;
  $scope.buttonChoiceRe = buttonChoiceRe;
  $scope.userInfo = {};

  function buttonChoiceCu(){
    $scope.buttonChoice = "customer";
  }

  function buttonChoiceRe(){
    $scope.buttonChoice = "restaurant";
  }

  function userType(){
    if($scope.buttonChoice === 'customer') {
      $state.go('customer.home');
    } else {
      $state.go('restaurant.home');
    }
  }

  function signIn() {
    if($scope.userInfo.email && $scope.userInfo.password) {
      ref.authWithPassword({
        email    : $scope.userInfo.email,
        password : $scope.userInfo.password
      }, function(error, authData) {
        if (error) {
          throw new Error(error);
        } else {
          User.set(authData);
          console.log(User.get());
          $scope.userType();
        }
      });
    }
  }
});
