'use strict';

angular.module('peepoltv.controllers')
  .controller('SignupCompleteCtrl', function ($scope, AuthService) {

    $scope.saveInfo = function() {
      var user = AuthService.user;
      if ($scope.username) {
        user.username = $scope.username;
      }
      if ($scope.email) {
        user.email = $scope.email;
      }
      user.$save();
    }

  });
