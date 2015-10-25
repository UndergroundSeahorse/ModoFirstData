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

.controller('CustHomeCtrl', function($scope) {
  console.log('Initialized Home Ctrl');
  $scope.restaurant = {
    name: "Test Restaurant",
    menu: [{name: "Item1", price: "$1.00"}, {name: "Item2", price: "$2.00"}, {name: "Item3", price: "$3.00"}, {name: "Item4", price: "$4.00"}, {name: "Item5", price: "$5.00"}, {name: "Item6", price: "$6.00"}]
  };
})

.controller('CustPayCtrl', function($scope, $braintree) {
  console.log('Initialized Cust Pay Ctrl');

  $scope.createCC = createCC;
  $scope.creditCard = {};
  $scope.changeCC = changeCC;

  var client;
  $scope.creditCard = {
    number: '',
    expirationDate: ''
  };

  var startup = function() {
    $braintree.getClientToken().success(function(token) {
      client = new $braintree.api.Client({
        clientToken: token
      });
    });
  };

  function changeCC() {
    var ex = $scope.creditCard.expirationDate;
    if(ex.length === 3) {
      var temp = ex;
      ex = 0 + ex[0] + "/" + ex[1] + ex[2];
      console.log(ex);
    } else if(ex.length === 4) {
      ex = ex[0] + ex[1] + "/" + ex[2] + ex[3];
      console.log(ex);
    } else if(ex.length === 5) {
      console.log('OK');
    } else {
      console.log('ERROR');
    }
  };

  function createCC() {
    // - Validate $scope.creditCard
    // - Make sure client is ready to use
    changeCC();
    if($scope.creditCard.number.length === 16 && $scope.creditCard.expirationDate.length === 5) {
      client.tokenizeCard({
        number: $scope.creditCard.number,
        expirationDate: $scope.creditCard.expirationDate
      }, function (err, nonce) {
        if(err) {
          console.log('error: ', err);
        } else {
          console.log('nonce: ', nonce);
          console.log($scope.creditCard.number);
          console.log($scope.creditCard.expirationDate)
        }
        // - Send nonce to your server (e.g. to make a transaction)
      });
    }
  };
  startup();
})

.controller('RestHomeCtrl', function($scope){
  console.log('Initialized RestHomeCtrl');
  $scope.customers = [{name: "Alex", uid: "alexuid"}, {name: "Trevor", uid: "trevoruid"}, {name: "Kenneth", uid: "kennethuid"}];
})

.controller('CustomerCtrl', function($scope, $stateParams, $ionicHistory) {
  $scope.customerId = $stateParams.customerId;
  $scope.name = "Alex";
  $scope.restaurant = {
    name: "Test Restaurant",
    menu: [{name: "Item1", price: 1.00, checked: false, num: 0}, {name: "Item2", price: 2.50, checked: false, num: 0}, {name: "Item3", price: 3.00, checked: false, num: 0}, {name: "Item4", price: 4.50, checked: false, num: 0}, {name: "Item5", price: 5.00, checked: false, num: 0}, {name: "Item6", price: 6.00, checked: false, num: 0}]
  };
  $scope.changeTotal = changeTotal;
  $scope.myGoBack = myGoBack;
  $scope.total = 0;

  function myGoBack() {
    $ionicHistory.goBack();
  };

  function changeTotal() {
    $scope.total = 0;
    for(var i=0; i<$scope.restaurant.menu.length; i++) {
      if($scope.restaurant.menu[i].checked) {
        $scope.total += ($scope.restaurant.menu[i].price * $scope.restaurant.menu[i].num);
      }
    }
  }
})

.controller('SplashCtrl', function($scope, $state) {
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
    if($scope.buttonChoice === "customer") {
      $state.go('customer.home');
    } else {
      $state.go('restaurant.home');
    }
  };

  function signIn() {
    if($scope.userInfo.email && $scope.userInfo.password) {
      ref.authWithPassword({
        email    : $scope.userInfo.email,
        password : $scope.userInfo.password
      }, function(error, authData) {
        if (error) {
          console.log("Login Failed!", error);
        } else {
          console.log("Authenticated successfully with payload:", authData);
          $scope.userType();
        }
      });
    };
  };
});
