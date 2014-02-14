'use strict';

angular.module('peepoltv.controllers')
  .controller('StreamCtrl', function ($scope, $stateParams, $timeout, Stream, AuthService, $location) {

		$scope.user = AuthService.user;
    $scope.url = encodeURIComponent($location.absUrl());
    $scope.shareTextEnconded = escape("Share this video!");

    // Get the stream
    $scope.stream = Stream.$find($stateParams.streamId);

		// Get the streams based on geolocation
    $scope.streams = Stream.$search();

  });
