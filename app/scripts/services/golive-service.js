'use strict';

angular.module('peepoltv.services')
  .service('GoliveService', function GoliveService($q, $rootScope, CameraService, Stream) {

    var self = this;

    this.stream = null;

    // Golive status
    this.status = 'disconnected';

    // Start the broadcast method
    this.startBroadcast = function(caption, coords){
      if(!CameraService.access){
        // The mic/cam permissions
        return;
      }

      // The service
      var stream = new Stream();

      // The live stream
      this.stream = stream;

      // Set status to connecting
      this.status = 'connecting';

      // Add thumbnail and caption
      angular.extend(stream, {
        thumb: getThumbnailURL(CameraService.licodeStream.player.video, 854, 480),
        caption: caption || ''
      });

      // Add geoloation data if it's available
      if(coords && coords.lng && coords.lat){
        angular.extend(stream, {
          lng: coords.lng,
          lat: coords.lat
        });
      }

      // Post the new stream to the server and return the promise
      return stream.$save().$promise;
    };

    // Stop the broadcast method
    this.stopBroadcast = function(){
      // Unpublish stream from room
      CameraService.licodeStream.room.unpublish(CameraService.licodeStream.getID());

      // Disconnect from room
      CameraService.licodeStream.room.disconnect();

      // Put the stream with live flag false
      return this.stream.$promise;
    };

    // Update stream
    // Receive an object with the properties to update
    this.updateStream = function(options, updateThumbnail){
      angular.extend(this.stream, options);

      // Update the thumbnail if required
      if(updateThumbnail){
        angular.extend(this.stream, {
          thumb: getThumbnailURL(CameraService.licodeStream.player.video, 854, 480)
        });
      }

      // Post the new stream to the server and return the promise
      return this.stream.$save().$promise;
    };

    // Update the thumbnail
    this.updateThumbnail = function(){
      // Add thumbnail and caption
      angular.extend(this.stream, {
        thumb: getThumbnailURL(CameraService.licodeStream.player.video, 854, 480)
      });

      // Post the new stream to the server and return the promise
      return this.stream.$save().$promise;
    };

    /**
     * PRIVATE
     */

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

    // Update golive service status based on room connection status
    $rootScope.$on('licode-room-status-changed', function(event, params){
      if(params.status === 'connecting'){
        self.status = 'connecting';
        $rootScope.app.onAir = false;
      }
      else if(params.status === 'disconnected'){
        self.status = 'disconnected';
        $rootScope.app.onAir = false;
      }
    });

    // Update golive service status based on stream status
    $rootScope.$on('licode-stream-status-changed', function(event, params){
      if(params.status === 'added'){
        self.status = 'connected';
        $rootScope.app.onAir = true;
      }
    });

  });
