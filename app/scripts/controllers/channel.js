'use strict';

angular.module('rhinobird.controllers')
  .controller('ChannelCtrl', function ($scope, $stateParams, $interval, $browser, AuthService, channel, $rootScope, VjService) {
    var POLLING_TIME = 10000; // 10 seconds

		$scope.user = AuthService.user;

    /**
     * SCOPE
     */
    $scope.self = $scope; // Expose the scope as self

    // The channel
    $scope.channel = channel;

    // The vj service
    $scope.vjService = VjService;

    // The live streams
    $scope.liveStreams = channel.streams.live(true);

    $scope.$on('stream-carousel-stream-changed', function(event, stream){

      // Set the current stream
      $scope.currentStream = stream;

      // Send message new pick
      if(VjService.live){
        VjService.activatePick(stream);
      }

    });

    $scope.$on('stream-carousel-audiostream-changed', function(event, stream, oldStream){

      // Set the current stream
      $scope.fixedAudioStream = stream;

      // Send message new pick
      if(VjService.live){
        if(stream){
          VjService.setFixedAudioPick(stream);
        }
        else {
          VjService.unsetFixedAudioPick(oldStream);
        }
      }

    });

    //function that adds new streams to the current live stream array
    var checkNewStreams = function() {
      channel.streams.live(true).$then(function(updatedStreams) {
        var currentIds = _.pluck($scope.liveStreams, 'id');
        var updatedIds = _.pluck(updatedStreams, 'id');
        var diff = _.difference(updatedIds, currentIds);
        var result = _.filter(updatedStreams, function(stream) { return diff.indexOf(stream.id) >= 0; });

        if (result.length > 0) {
          //notify directive to destroy carousel
          $rootScope.$broadcast('stream-carousel-updated');
        }

        //add streams to the array
        angular.forEach(result, function(stream) {  $scope.liveStreams.push(stream);  });
      });
    };

    // check for new streams every 10 seconds
    var polling = $interval(checkNewStreams, POLLING_TIME);


    // cancel polling on controller destroy
    $scope.$on('$destroy', function() {
      $interval.cancel(polling);
    });

    $scope.$on('stream-carousel-changed', function(event, status){
      var action = status.action;

      // Send message new pick
      if(VjService.live){
        if(status.action === 'add'){
          VjService.addPick(status.stream);
        }
        else if(status.action === 'remove'){
          VjService.removePick(status.stream);
        }
      }
    });

    // Run when the video element is created
    $scope.$on('licode-video-created', function(event, stream){

      // Only when there is no current stream
      if(!$scope.currentStream){
        var eventStream = _.find($scope.liveStreams, function(s){return s.licode.getID() === stream.getID();});

        // Choose the first strea to play in the main screen
        if(_.indexOf($scope.liveStreams, eventStream) === 0){
          // Set the current stream
          $scope.currentStream = eventStream;
        }
      }
    });

    $scope.startVj = function(){
      // The current stream id
      var currentStreamId = ($scope.currentStream)? $scope.currentStream.id : undefined;
      var fixedAudioStreamId = ($scope.fixedAudioStream)? $scope.fixedAudioStream.id : undefined;
      var pickedStreams = _.filter($scope.liveStreams, function(s){ return s.isConnected; });

      // Start the vj
      if(pickedStreams && pickedStreams.length >= 1){
        VjService.startBroadcast(pickedStreams, currentStreamId, fixedAudioStreamId, $scope.channel.name);
      }
    };

    $scope.stopVj = function(){
      VjService.stopBroadcast();
    };

  });
