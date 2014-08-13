'use strict';

angular.module('rhinobird.services')
  .service('GoliveService', function GoliveService($q, $rootScope, $timeout, CameraService, Stream) {

    var self = this;

    this.stream = null;

    // Golive status
    this.status = 'disconnected';

    // Connectime time
    this.connectingTime = 0;

    // Start the broadcast method
    this.startBroadcast = function(caption, coords, sharing){
      if(!CameraService.access){
        // The mic/cam permissions
        return;
      }

      // The service
      var stream = Stream.$build();

      // The live stream
      this.stream = stream;

      // Set status to connecting
      this.status = 'connecting';

      // Add thumbnail and caption
      angular.extend(stream, {
        caption: caption || ''
      });

      // Adds sharing options
      angular.extend(stream, sharing);

      // Add geoloation data if it's available
      if(coords && coords.lng && coords.lat){
        angular.extend(stream, {
          lng: coords.lng,
          lat: coords.lat
        });
      }

      // Post the new stream to the server and return the promise
      var promise = stream.$save().$promise;

      // Defere the thumbnail creation
      promise.then(function(){
        self.updateThumbnail();
      });

      return promise;
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
          thumb: getThumbnailURL(CameraService.licodeStream.player.video)
        });
      }

      // Post the new stream to the server and return the promise
      return this.stream.$save().$promise;
    };

    // Update the thumbnail
    this.updateThumbnail = function(){
      // Update only the thumbnail
      return this.updateStream({}, true);
    };

    /**
     * PRIVATE
     */

    // Get a proportional thumbnail
    var getThumbnailURL = function(video, width, height){
      // Default values
      width = width || video.videoWidth;
      height = height || video.videoHeight;

      // Canvas
      var canvas = document.createElement('canvas');
      canvas.ctx = canvas.getContext('2d');
      canvas.width = width;
      canvas.height = height;

      // Create and return the image
      canvas.ctx.drawImage( video, 0, 0, width, height);
      return canvas.toDataURL('image/jpeg');
    };

    // Update golive service status based on room connection status
    $rootScope.$on('licode-room-status-changed', function(event, params){
      if(params.status === 'connecting'){
        self.status = 'connecting';
        $rootScope.app.onAir = false;

        var checkStatus = function(){
          $timeout(function(){
            self.connectingTime++;            
            if(self.status === 'connecting'){
              checkStatus();
            }
          }, 1000);
        }

        checkStatus();
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

    // Update stream recoding id when the recording is started
    $rootScope.$on('licode-stream-recording-started', function(event, recordingId){
      if(recordingId){
        self.stream.recordingId = recordingId;
        self.stream.$save();
      }
    });

  });
