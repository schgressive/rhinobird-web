'use strict';

angular.module('rhinobird.controllers')
  .controller('PasswordResetCtrl', function ($scope, AuthService, $stateParams) {

    // Call API to reset password
    $scope.resetPassword = function() {

      $scope.invalidToken = false;

      var resetData = {
        token: $scope.reset_password_token,
        password: $scope.resetData.password,
        password_confirmation: $scope.resetData.confirm
      };

      AuthService.resetPassword(resetData).then(function() {
        $scope.$close();
        AuthService.askLogin();
      },
      function(e) { // Handle errors
        var error = e.$response.data;
        $scope.invalidToken = (!angular.isUndefined(error.reset_password_token) && error.reset_password_token[0].match(/invalid/) != null);
        $scope.passwordError = (!angular.isUndefined(error.password) && error.password[0].match(/match|short/) != null);
        $scope.passwordErrorText = error.password[0];
      });

    };
  });


