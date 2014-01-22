'use strict';

angular.module('peepoltv.controllers')
  .controller('ChannelCtrl', function ($scope, $stateParams, $timeout, $browser, AuthService, channel) {

		$scope.user = AuthService.user;

    /**
     * SCOPE
     */
    $scope.self = $scope; // Expose the scope as self

    // The channel
    $scope.channel = channel;

    // The live streams
    $scope.liveStreams = channel.streams.live();

    $scope.$on('main-stream-changed', function(event, stream){

      // Set the current stream
      $scope.currentStream = stream;

    });

    // Update golive service status based on stream status
    $scope.$on('licode-video-created', function(event, stream){

      var eventStream = _.find($scope.liveStreams, function(s){return s.streamId === stream.getID();});

      if(_.indexOf($scope.liveStreams, eventStream) === 0){

        // Set the current stream
        $scope.currentStream = eventStream;
      }
    });

  });
