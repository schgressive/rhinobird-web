'use strict';

angular.module('peepoltv.controllers')
  .controller('GoliveCtrl', function ($scope, $modal, $state, $rootScope, settings, session, Stream, GeolocationService, CameraService, GoliveService) {

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
    $scope.vm.caption_warning = false;

    // The the caption for the stream
    vm.caption = '';

    // Camera service
    vm.camera = CameraService;

    // Golive service
    vm.goliveService = GoliveService;

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
      GoliveService.startBroadcast(captionPayload, coordsPayload);
    };

    // Stop the current broadcast
    this.stop = function(goback){
      // Stop the broadcast in the golive service
      GoliveService.stopBroadcast().then(function(){
        // Go back
        if(goback && CameraService.licodeStream.stream){
          CameraService.licodeStream.stream.stop();
          $state.go('profile');
        }

      });

    };

    this.updateCaption = function(caption){
      var payload = {
        caption: caption
      };

      GoliveService.updateStream(payload);
    };

    /**
     * EVENTS
     */

    // Hashtags
    $scope.$watch('vm.caption', function(a){
      if(a){
        // sets warning for long caption
        if (a.length > 17) {
          vm.caption_warning = true;
        } else {
          vm.caption_warning = false;
        }

        var hashes = a.match(regexp);
        vm.channels = _.map(hashes, function(c){
          return c.replace(settings.channelCleanedRegex, '');
        });
      }
    });

    $scope.$on('golive', function() {
      openDialog();
    });

    // When the stream gets published
    $scope.$on('licode-stream-status-changed', function(event, params){
      if(params.status === 'added'){
        // Update the stream id
        var payload = {
          streamId: params.stream.getID()
        };
        GoliveService.updateStream(payload, true).then(function(){
          // Close the modal
          modalInstance.close();
        });
      }
    });

    // Get current location
    GeolocationService.getCurrent();

    // Open de dialog
    var openDialog = function(){
      modalInstance = $modal.open({
        backdrop: 'static',
        templateUrl: '/views/modals/golive-modal.html',
        scope: $scope
      });
    };
    openDialog();

  });
