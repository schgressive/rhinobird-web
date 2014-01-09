'use strict';

angular.module('peepoltvApp')
  .controller('GoliveCtrl', function ($scope, $modal, $rootScope, settings, session, Stream, GeolocationService, CameraService, GoliveService) {

		$scope.user = session.user;

    /**
     * VARIABLES
     */
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

    // Use geolocation with default
    vm.useGeolocation = true;

    // Start the new broadcast
    this.ready = function(){
      var coordsPayload, captionPayload;

      // Add metadata metadata
      if(vm.useGeolocation){
        // Only add geoloaction if the that is resolved from the service
        if(GeolocationService.resolved){
          coordsPayload = {
            lng: GeolocationService.current.lng,
            lat: GeolocationService.current.lat
          };
        }
      }

      // Add captions
      captionPayload = vm.caption;

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

    // Hashtags
    $scope.$watch('vm.caption', function(a){
      if(a){
        var hashes = a.match(regexp);
        vm.channels = _.map(hashes, function(c){
          return c.replace(settings.channelCleanedRegex, '');
        });
      }
    });

    // Update the stream id
    $scope.$on('licode-stream-added', function(event, newStream){
      var payload = {
        streamId: newStream.getID()
      };

      GoliveService.updateStream(payload);
    });

    // Get current location
    GeolocationService.getCurrent();

    // Open de dialog
    modalInstance = $modal.open({
      backdrop: 'static',
      templateUrl: '/views/modals/golive-modal.html',
      scope: $scope
    });

  });
