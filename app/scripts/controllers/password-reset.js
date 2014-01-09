'use strict';

angular.module('peepoltv.controllers')
  .controller('PasswordResetCtrl', function ($scope, AuthService, $stateParams) {

    // Call API to reset password
    $scope.resetPassword = function() {

      $scope.invalidToken = false;

      var resetData = {
        token: $stateParams.reset_password_token,
        password: $scope.resetData.password,
        password_confirmation: $scope.resetData.confirm
      }

      AuthService.resetPassword(resetData).then(function(e) {
        $scope.$close();
      },
      function(e) { // Handle errors
        var error = e.$response.data;
        $scope.invalidToken = (!angular.isUndefined(error.reset_password_token) && error.reset_password_token[0].match(/invalid/) != null);
      });

    }
  });


