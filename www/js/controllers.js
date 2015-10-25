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

.controller('SplashCtrl', function($scope, $state) {
  $scope.buttonChoice = "customer";
  $scope.userType = userType;
  $scope.signIn = signIn;
  $scope.buttonChoiceCu = buttonChoiceCu;
  $scope.buttonChoiceRe = buttonChoiceRe;
  $scope.userInfo = {};

  ref.child('api').child('key').set('hwPXBS0ZFwxVlPFVg2RT0XWvARNUF23I');
  ref.child('api').child('secret').set('b67850b1ed19ea19fe336789f293cc320f3df7d63d92a4098f138b1cb8a035bb');
  ref.child('api').child('token').set('c2e89a9e43603be8');

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
