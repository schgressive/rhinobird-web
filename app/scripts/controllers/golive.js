'use strict';

angular.module('peepoltvApp')
  .controller('GoliveCtrl', function ($scope, streamService, geolocation, $rootScope) {

    // Change the location when is changed
    $scope.$on('locationChanged', function (event, parameters) {

      // Open the init stream dialog
      $scope.goLiveInitModal = true;

      startLocalStream(parameters);

    });

    // Get current location
    geolocation();

    // Modal Options
    $scope.opts = {
      backdropFade: true,
      dialogFade:true,
      keyboard: false,
      backdropClick: false
    };

    $scope.startBroadcast = function(metadata){
      if(!$scope.localStream.showing){
        // The mic/cam permissions
        $scope.permissionAlert = true;
        return;
      }

      // Hide the modal
      $scope.goLiveInitModal = false;

      // Star the broadcast
      goOnAir(metadata);

    };

    // Stream data from the init modal
    $scope.streamData = {};

    $scope.streamingOptions = $rootScope.streamingOptions;

    // Start the local stream
    var startLocalStream = function(parameters){
      // Save the coords in the scope
      $scope.coords = parameters.coordinates;

      // Get the user media and show the feedback
      $scope.localStream = Erizo.Stream({audio: true, video: true, data: false});
      $scope.localStream.init();

      $scope.localStream.addEventListener('access-accepted', function () {
        console.log('Access to webcam and microphone granted');

        $scope.$apply(function() {
          // The mic/cam permissions
          $scope.permissionAlert = false;
        });
        // Show the video
        $scope.localStream.show('myBroadcast');
        $scope.localStream.player.video.muted = true;

      });

      $scope.localStream.addEventListener('access-denied', function() {
        console.log('Access to webcam and microphone rejected');

        // The mic/cam permissions
        $scope.permissionAlert = true;
      });
    }

    // Start the transitions
    var goOnAir = function(metadata){
      var streamData = {
        lng: $scope.coords.longitude,
        lat: $scope.coords.latitude,
        thumb: getThumbnail($scope.localStream.player.video, 854, 480)
      };

      // Add the metadata
      if(metadata){
        streamData.title = ($scope.streamData.titleCheck)? $scope.streamData.titleData : "";
        // here i need to add tags, geolocation, and channel hashtag logics
      }

      // Post the new stream to the server
      streamService.resource.new(streamData, function(data){

        $scope.room = Erizo.Room({token: data.token});
        $scope.room.connect();
        $scope.room.addEventListener('room-connected', function() {
          // Publish stream to the room
          $scope.room.publish($scope.localStream);
        });

        $scope.room.addEventListener('stream-added', function(event) {
          if ($scope.localStream.getID() === event.stream.getID()) {
            console.log('Published!!!');
          }
        });
      });
    };

    var getThumbnail = function(video, width, height){

      var tWidth, tHeight;
      var canvas = document.createElement('canvas');
      canvas.ctx = canvas.getContext('2d');
      canvas.width = width;
      canvas.height = height;

      tWidth = width;
      tHeight = $(video).height()*width/$(video).width();

      canvas.ctx.drawImage( video, 0, 0, tWidth, tHeight);

      return canvas.toDataURL("image/jpeg");
    };
  });
