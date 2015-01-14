'use strict';

angular.module('rhinobird.controllers')
  .controller('StreamCtrl', function ($scope, $window, $stateParams, $timeout, Stream, AuthService, $location, stream) {

		$scope.user = AuthService.user;
    $scope.url = encodeURIComponent($location.absUrl());
    $scope.shareTextEnconded = $window.escape('Share this video!');

    // Get the stream
    $scope.stream = stream;

		// Get the streams based on geolocation
    $scope.streams = stream.related.$fetch();

    $scope.like = function() {
      stream.toggleLike();
    }

    $scope.liked = function() {
      return stream.liked;
    }

    // Expose methods to the VM
    vm.getClass = getClass;

    // PRIVATE METHODS
    //
    // apply active class to tabs
    function getClass(path) {
      if ($location.path().substr(0, path.length) === path) {
        return 'active';
      } else {
        return '';
      }
    };


  });
