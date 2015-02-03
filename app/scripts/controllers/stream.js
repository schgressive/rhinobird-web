'use strict';

angular.module('rhinobird.controllers')
  .controller('StreamCtrl', function ($scope, $window, $state, $timeout, Stream, AuthService, $location, stream, Timeline) {

    $scope.user = AuthService.user;
    $scope.user.timeline.getNextPage();

    $scope.url = encodeURIComponent($location.absUrl());
    $scope.shareTextEnconded = $window.escape('Share this video!');

    // Get the stream
    $scope.stream = stream;

    // Get the streams based on geolocation
    $scope.streams = stream.related.$fetch();

    // returns true if stream is live
    $scope.streamLive = function() {
      return stream.status === 'live';
    }

    $scope.repost = function() {
      var time = Timeline.$new(stream.timelineId);
      time.reposts.$create();
    }

    $scope.like = function() {
      stream.toggleLike();
    }

    $scope.liked = function() {
      return stream.liked;
    }

    // Expose methods to the VM

    // Choose default tab
    if ($scope.streamLive()) {
      $state.go('stream.user');
    } else {
      $state.go('stream.comments');
    }

    // PRIVATE METHODS
    //

  });
