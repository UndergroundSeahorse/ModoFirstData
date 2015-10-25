angular.module('starter.controllers', [])
  .controller('PaymentInfoController', function (firstDataApi) {

    $scope.tokenize = tokenize;

    //////////

    function tokenize () {
      var ccType = $scope.creditCardType;
      var ccNumber = $scope.creditCardNumber;
      var ccName = $scope.creditCardName;

      firstDataApi.tokenize()
    }
  })
