'use strict';

angular.module('peepoltv.services')
  .service('GoliveService', function GoliveService($q, CameraService, Stream) {

    // The service
    var stream = new Stream();

    // The live stream
    this.stream = stream;

    // Start the broadcast method
    this.startBroadcast = function(caption, coords){
      if(!CameraService.access){
        // The mic/cam permissions
        return;
      }

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
      return $q.when(stream.$save().$promise);
    };

    // Stop the broadcast method
    this.stopBroadcast = function(){
      // Unpublish stream from room
      CameraService.licodeStream.room.unpublish(CameraService.licodeStream.getID());

      // Disconnect from room
      CameraService.licodeStream.room.disconnect();

      // Set the stream model as no live
      stream.live = false;

      // Put the stream with live flag false
      return $q.when(stream.$save().$promise);
    };

    // Update stream
    // Receive an object with the properties to update
    this.updateStream = function(options){
      angular.extend(stream, options);

      // Post the new stream to the server and return the promise
      return $q.when(stream.$save().$promise);
    };

    // Update the thumbnail
    this.updateThumbnail = function(){
      // Add thumbnail and caption
      angular.thumb = getThumbnailURL(CameraService.licodeStream.player.video, 854, 480);

      // Post the new stream to the server and return the promise
      return $q.when(stream.$save().$promise);
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
  });
