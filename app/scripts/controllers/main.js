'use strict';

angular.module('rhinobird.controllers')

  .controller('MainCtrl', function ($scope, $stateParams, $state, AuthService) {

    // Expose the scope as self
    $scope.self = $scope;
    // default route
    $state.go('main.world');

    // Set the user in scope
    $scope.user = AuthService.user;
    AuthService.getSession().then(function() {},
                                  function() {
      if ($stateParams.signup) {
        AuthService.askLogin('signup');
      }

    });


    if ($stateParams.reset_password_token) {
      AuthService.askLogin('password-reset');
    }

    if ($stateParams.complete) {
      AuthService.finishSocialSignup($stateParams.complete);
    }

  });
