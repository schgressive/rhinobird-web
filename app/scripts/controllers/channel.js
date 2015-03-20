'use strict';

angular.module('rhinobird.controllers')
  .controller('ChannelCtrl', function ($scope, $stateParams, $interval, $browser, AuthService, channel, $rootScope, VjService, GeolocationService) {
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

    // The past streams
    $scope.pastStreams = channel.streams;
    $scope.pastStreams.$fetch();

    // The Vj ongoing status
    $scope.vjStarted = false;

    $scope.$on('stream-carousel-stream-changed', function(event, stream){

      // Set the current stream
      $scope.currentStream = stream;

      // Send message new pick
      if(VjService.live){
        VjService.activatePickByStreamId(stream.id);
      }

    });

    $scope.$on('stream-carousel-audiostream-changed', function(event, stream, oldStream){

      // Set the current stream
      $scope.fixedAudioStream = stream;

      // Send message new pick
      if(VjService.live){
        if(stream){
          VjService.fixAudioPickByStreamId(stream.id);
        }
        else {
          VjService.unfixAudioPickByStreamId(oldStream.id);
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

    $scope.$on('$destroy', function() {
      // cancel polling on controller destroy
      $interval.cancel(polling);

      // Stop the vj if the user navigates away
      VjService.stopBroadcast();
    });

    $scope.$on('$locationChangeStart', function(event, next, current) {
      if(VjService.live && !confirm("You have an ongoing vj, you really want to leave this page?")) {
        event.preventDefault();
      }
    });

    $scope.$on('stream-carousel-changed', function(event, status){
      // Send message new pick
      if(VjService.live){
        if(status.action === 'add'){
          VjService.addPickByStreamId(status.stream.id);
        }
        else if(status.action === 'remove'){
          VjService.removePickByStreamId(status.stream.id);
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
      var coordsPayload;
      // The current stream id
      var currentStreamId = ($scope.currentStream)? $scope.currentStream.id : undefined;
      var fixedAudioStreamId = ($scope.fixedAudioStream)? $scope.fixedAudioStream.id : undefined;
      var pickedStreams = _.filter($scope.liveStreams, function(s){ return s.isConnected; });

      // Only add geoloaction if the that is resolved from the service
      if(GeolocationService.resolved){
        coordsPayload = {
          lng: GeolocationService.current.lng,
          lat: GeolocationService.current.lat
        };
      }

      // Start the vj
      if(pickedStreams && pickedStreams.length >= 1){
        VjService.startBroadcast(pickedStreams, currentStreamId, fixedAudioStreamId, $scope.channel.name, coordsPayload).$then( function () {
          // The room id for vj comments
          $scope.vjCommentsRoomId = channel.name + '-' + $scope.user.username + '-' + VjService.vj.id;
          $scope.vjStarted = true;
        });
      }
    };

    $scope.stopVj = function(){
      VjService.stopBroadcast();
      $scope.vjStarted = false;
    };

    $scope.willPlayback = function () {
      return $scope.liveStreams && $scope.liveStreams.length > 0 && !$scope.currentStream;
    };

    $scope.showPastStreams = function () {
      return $scope.pastStreams && $scope.pastStreams.length > 0 && !$scope.currentStream;
    };

    GeolocationService.getCurrent();

  });
