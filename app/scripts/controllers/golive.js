'use strict';

angular.module('peepoltvApp')
  .controller('GoliveCtrl', function ($scope, streamService, geolocation, $rootScope) {

    // Change the location when is changed
    $scope.$on('locationChanged', function (event, parameters) {
      $scope.coords = parameters.coords;
    });

    // Get current location
    geolocation.getCurrent();

    // Modal Options
    $scope.opts = {
      backdropFade: true,
      dialogFade:true,
      keyboard: false,
      backdropClick: false
    };

    // Open de dialog
    $scope.goLiveInitModal = true;

    // Start the broadcast
    $scope.startBroadcast = function(metadata){
      if(!$scope.localStream.permissionsGranted){
        // The mic/cam permissions
        return;
      }

      // Hide the modal
      $scope.goLiveInitModal = false;

      // Star the broadcast
      goOnAir(metadata);

    };

    $scope.stopBroadcast = function(){
      $scope.stream.token = null;
    };

    // Stream data from the init modal
    $scope.streamOptions = {
      geoCheck: true
    };

    // Header streaming options
    $scope.streamingOptions = $rootScope.streamingOptions;

    $rootScope.$on('liveStreamStopped', function(e, r){
      $scope.stream.token = "";
      if(!r.stay && $scope.localStream.stream){
        $scope.localStream.stream.stream.stop();
        history.back();
      }
    });

    // Get a proportional thumbnail
    var getThumbnailURL = function(video, width, height){
      // Canvas
      var canvas = document.createElement('canvas');
      canvas.ctx = canvas.getContext('2d');
      canvas.width = width;
      canvas.height = height;

      // Destination size
      var dWidth = width;
      var dHeight = $(video).height()*width/$(video).width();

      // Create and return the image
      canvas.ctx.drawImage( video, 0, 0, dWidth, dHeight);
      return canvas.toDataURL('image/jpeg');
    };

    // Start the transitions
    var goOnAir = function(metadata){
      var streamData = {
        thumb: getThumbnailURL($scope.localStream.stream.player.video, 854, 480)
      };

      // Add the metadata
      if(metadata){
        streamData.title = ($scope.streamOptions.titleCheck)? $scope.streamOptions.titleData : '';

        if($scope.streamOptions.geoCheck){
          streamData.lng = $scope.coords.lng;
          streamData.lat = $scope.coords.lat;
        }
        if($scope.streamOptions.channelCheck){
          streamData.channel = $scope.streamOptions.channelName
        }
        if($scope.streamOptions.tagsCheck){
          streamData.tags = $scope.streamOptions.tags
        }
      }

      // Post the new stream to the server
      $scope.stream = streamService.resource.new(streamData);
    };

  });
