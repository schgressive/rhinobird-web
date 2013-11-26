'use strict';

angular.module('peepoltvApp')

  .controller('MainCtrl', function ($scope, $location, $timeout, $stateParams, Stream, AuthService) {

    // Get the streams based on geolocation
    $scope.streams = Stream.$search();

    // Search streams
    $scope.searchStreams = function(){
      $location.url("/search?q=" + $scope.searchString);
    };

    $scope.user = AuthService.user;

    if ($stateParams.reset_password_token) {
      AuthService.askLogin("password-reset");
    }

  });
