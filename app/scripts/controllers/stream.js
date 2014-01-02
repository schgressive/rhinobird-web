'use strict';

angular.module('peepoltvApp')
  .controller('StreamCtrl', function ($scope, $stateParams, $timeout, Stream, AuthService) {

		$scope.user = AuthService.user;

    // Get the stream
    $scope.stream = Stream.$find($stateParams.streamId);

		// Get the streams based on geolocation
    $scope.streams = Stream.$search();

  });
