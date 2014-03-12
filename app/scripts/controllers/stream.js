'use strict';

angular.module('peepoltv.controllers')
  .controller('StreamCtrl', function ($scope, $stateParams, $timeout, Stream, AuthService, $location, stream) {

		$scope.user = AuthService.user;
    $scope.url = encodeURIComponent($location.absUrl());
    $scope.shareTextEnconded = escape("Share this video!");

    // Get the stream
    $scope.stream = stream;

		// Get the streams based on geolocation
    $scope.streams = stream.related.$fetch();

  });
