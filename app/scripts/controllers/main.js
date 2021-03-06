'use strict';

angular.module('rhinobird.controllers')

  .controller('MainCtrl', function ($scope, $stateParams, $state, AuthService) {

    // Expose the scope as self
    $scope.self = $scope;
    // default route
    $state.go('main.world');

    $scope.isActive = function(states) {
      var included = false;
      angular.forEach(states, function(state) {
        var stateIncluded = $state.includes(state);
        if (stateIncluded) {
          included = stateIncluded;
          return;
        }
      })
      return included;
    }

    // Set the user in scope
    $scope.user = AuthService.user;
    AuthService.getSession().then(function() {},
                                  function() {
      if ($stateParams.signup) {
        AuthService.askLogin('signup');
      }

      if ($stateParams.reset_password_token) {
        AuthService.askLogin('password-reset', {reset_password_token: $stateParams.reset_password_token});
      }

      if ($stateParams.complete) {
        AuthService.finishSocialSignup($stateParams.complete);
      }

    });

  });
