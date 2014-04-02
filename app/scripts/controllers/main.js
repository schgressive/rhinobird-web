'use strict';

angular.module('rhinobird.controllers')

  .controller('MainCtrl', function ($scope, $stateParams, Stream, AuthService) {

    // Expose the scope as self
    $scope.self = $scope;

    // Get the streams
    $scope.streams = Stream.$collection({ live: true, archived: true });
    $scope.streams.getNextPage();

    // Set the user in scope
    $scope.user = AuthService.user;

    if ($stateParams.reset_password_token) {
      AuthService.askLogin('password-reset');
    }

    if ($stateParams.complete) {
      AuthService.finishSocialSignup($stateParams.complete);
    }

  });
