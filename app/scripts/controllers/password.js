'use strict';

angular.module('peepoltvApp')
  .controller('PasswordCtrl', function ($scope, AuthService) {

    $scope.askPasswordReset = function() {
      $scope.invalidEmail = false;

      var data = {
        email: $scope.user.email
      }

      AuthService.askPasswordReset(data).then(function(e) {
        $scope.$close();
      },
      function(e) {
        $scope.invalidEmail = true;
      });

    }
  });

