'use strict';

angular.module('peepoltvApp')
  .controller('GoliveCtrl', function ($scope, $modal, $rootScope, Stream, geolocation, CameraService, GoliveService) {

    /**
     * VARIABLES
     */
    var coords; // Coordinates and stream model
    var vm = {}; // Define viewmodel
    var regexp = new RegExp('#([^\\s|^#]+)','g'); // Hashtag regex
    var modalInstance; // The modal dialog

    /**
     * SCOPE
     */
    $scope.vm = vm; // Expose the viewmodel in the scope
    $scope.ctrl = this; // Expose the controller

    // The the caption for the stream
    vm.caption = '';

    // Camera service
    vm.camera = CameraService;

    // The stream
    vm.stream = GoliveService.stream;

    // Start the new broadcast
    this.ready = function(skipMetadata){
      var coordsPayload, captionPayload;

      // Add metadata metadata
      if(!skipMetadata){
        coordsPayload = {
          lng: coords.lng,
          lat: coords.lat
        };
        captionPayload = vm.caption;
      }

      // Start the broadcast in the golive service
      GoliveService.startBroadcast(captionPayload, coordsPayload).then(function(){
        modalInstance.close();
      });
    };

    // Stop the current broadcast
    this.stop = function(goback){
      // Stop the broadcast in the golive service
      GoliveService.stopBroadcast().then(function(){
        // Go back
        if(goback && CameraService.licodeStream.stream){
          CameraService.licodeStream.stream.stream.stop();
          history.back();
        }

      });

    };

    /**
     * EVENTS
     */

    // Change the location when is changed
    $scope.$on('locationChanged', function (event, parameters) {
      coords = parameters.coords;
    });

    // Hashtags
    $scope.$watch('vm.caption', function(a){
      if(a){
        vm.channels = a.match(regexp);
      }
    });

    // Get current location
    geolocation.getCurrent();

    // Open de dialog
    modalInstance = $modal.open({
      backdrop: 'static',
      templateUrl: '/views/snippets/golive-modal.html',
      scope: $scope
    });

  });
