'use strict';

angular.module('rhinobird.controllers')
  .controller('StreamCtrl', function ($scope, $state, AuthService, stream, mobileDetect) {

    $scope.user = AuthService.user;
    $scope.timeline = stream.user.timeline;
    $scope.timeline.getNextPage();

    // Get the stream
    $scope.stream = stream;

    // Get the streams based on geolocation
    $scope.streams = stream.related.$fetch();

    // returns true if stream is live
    $scope.streamLive = function() {
      return stream.status === 'live';
    }

    // Choose default tab
    if ($scope.streamLive() && !mobileDetect()) {
      $state.go('stream.user');
    } else {
      $state.go('stream.comments');
    }

    // PRIVATE METHODS
    //

  });
