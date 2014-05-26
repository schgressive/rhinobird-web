'use strict';

angular.module('rhinobird.controllers')

  .controller('MainCtrl', function ($scope, $stateParams, Timeline, AuthService) {

    // Expose the scope as self
    $scope.self = $scope;

    // Get the timeline
    $scope.timeline = Timeline.$collection();
    $scope.timeline.getNextPage();

    // Set the user in scope
    $scope.user = AuthService.user;

    if ($stateParams.reset_password_token) {
      AuthService.askLogin('password-reset');
    }

    if ($stateParams.complete) {
      AuthService.finishSocialSignup($stateParams.complete);
    }

  });
