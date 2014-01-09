'use strict';

angular.module('peepoltv.controllers')
  .controller('PasswordCtrl', function ($scope, AuthService) {

    $scope.askPasswordReset = function() {
      $scope.invalidEmail = false;

      var data = {
        email: $scope.user.email
      };

      AuthService.askPasswordReset(data).then(function() {
        $scope.$close();
      },
      function() {
        $scope.invalidEmail = true;
      });

    };
  });

