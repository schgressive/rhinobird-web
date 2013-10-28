'use strict';

angular.module('peepoltvApp')
  .controller('GoliveCtrl', function ($scope, $modal, $rootScope, Stream, geolocation, CameraService) {

    /**
     * VARIABLES
     */
    var coords, stream; // Coordinates and stream model
    var regexp = new RegExp('#([^\\s|^#]+)','g'); // Hashtag regex
    var streamPayload = {}; // Information to create the new stream
    var streamingOptions = $rootScope.streamingOptions;

    /**
     * SCOPE
     */

    // The stream model
    $scope.stream = stream;

    // Camera service
    $scope.camera = CameraService;

    // Licode stream
    $scope.licodeStream = CameraService.licodeStream;

    // Stream data from the init modal
    $scope.streamPayload = streamPayload;

    // Header streaming options
    $scope.streamingOptions = streamingOptions;

    // Start the broadcast method
    $scope.startBroadcast = function(metadata){
      if(!CameraService.access){
        // The mic/cam permissions
        return;
      }
      // Hide the modal
      modalInstance.close();

      // Star the broadcast
      goOnAir(metadata, CameraService.licodeStream, streamPayload);

    };

    // Stop the broadcast method
    $scope.stopBroadcast = function(){
      stream.token = null;
    };

    /**
     * EVENTS
     */

    // Change the location when is changed
    $scope.$on('locationChanged', function (event, parameters) {
      coords = parameters.coords;
    });

    // Handle the broadcast stopped event
    $rootScope.$on('liveStreamStopped', function(e, r){
      // Unpublish stream from room
      CameraService.licodeStream.stream.room.unpublish(CameraService.licodeStream.stream.getID());

      // Disconnect from room
      CameraService.licodeStream.stream.room.disconnect();

      // Set the stream model as no live
      stream.live = false;
      stream.$save({streamId: $scope.stream.id});

      // Go back
      if(!r.stay && CameraService.licodeStream.stream){
        CameraService.licodeStream.stream.stream.stop();
        history.back();
      }
    });

    // Hashtags
    $scope.$watch('streamPayload.caption', function(a){
      if(a){
        $scope.channels = a.match(regexp);
      }
    });

    /**
     * INIT
     */

    // Get current location
    geolocation.getCurrent();

    // Open de dialog
    var modalInstance = $modal.open({
      backdrop: 'static',
      templateUrl: '/views/snippets/golive-modal.html',
      scope: $scope
    });


    /**
     * PRIVATE
     */

    // Start the transitions
    var goOnAir = function(metadata, licodeStream, streamPayload){
      var streamData = {
        thumb: getThumbnailURL(licodeStream.player.video, 854, 480)
      };

      // Add the metadata
      if(metadata){
        streamData.caption = streamPayload.caption || '';

        if(coords && coords.lng && coords.lat){
          streamData.lng = coords.lng;
          streamData.lat = coords.lat;
        }
      }

      // Post the new stream to the server
      $scope.stream = Stream.$create(streamData);
    };

    // Get a proportional thumbnail
    var getThumbnailURL = function(video, width, height){
      // Canvas
      var canvas = document.createElement('canvas');
      canvas.ctx = canvas.getContext('2d');
      canvas.width = width;
      canvas.height = height;

      // Destination size
      var dWidth = width;
      var dHeight = angular.element(video).height() * width / angular.element(video).width();

      // Create and return the image
      canvas.ctx.drawImage( video, 0, 0, dWidth, dHeight);
      return canvas.toDataURL('image/jpeg');
    };

  });
