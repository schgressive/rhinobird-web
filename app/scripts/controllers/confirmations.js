'use strict';

angular.module('rhinobird.controllers')
  .controller('ConfirmationsCtrl', function ($scope, AuthService, $stateParams) {

    // Call API to send confirmation instructions
    $scope.sendConfirmation = function() {

      $scope.invalidEmail = false;

      var data = {
        user: {
          email: $scope.user.email
        }
      };

      AuthService.sendConfirmation(data).then(function() {
        $scope.$close();
      },
      function() {
        $scope.invalidEmail = true;
      });

    };
  });



