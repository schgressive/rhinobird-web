'use strict';

angular.module('rhinobird.controllers')
  .controller('GoliveCtrl', function ($scope, $modal, $state, $rootScope, settings, session,
                                      Stream, GeolocationService, CameraService, GoliveService, $timeout, Channel,
                                     OpenAndWatch) {

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
    $scope.vm.captionWarning = false;
    $scope.vm.showSuccess = false;

    // The the caption for the stream
    vm.caption = '';

    // Camera service
    vm.camera = CameraService;

    // Sharing Options
    vm.sharingOptions = {
      shareTwitter: $scope.user.shareTwitter,
      shareFacebook: $scope.user.shareFacebook
    }

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
      GoliveService.startBroadcast(captionPayload, coordsPayload, vm.sharingOptions );
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

    // Tries to connect social network if not connected
    this.tryConnection = function(network, share) {

      if (share && !$scope.user[network + "Connected"]) {
        OpenAndWatch.open("/registration/" + network + "?popup=true", "_blank", {}, function(win) {
          session.$fetch();
        });
      }
    }

    // Updates the thumbnail
    this.updateThumbnail = function() {
      GoliveService.updateThumbnail().then(function() {
        vm.showSuccessSnapshot = true;
        $timeout(function() {
          vm.showSuccessSnapshot = false;
        }, 3000);
      });
    };

    this.updateCaption = function(caption){
      var payload = {
        caption: caption
      };

      GoliveService.updateStream(payload).then(function() {
        vm.showSuccess = true;
        $timeout(function() {
          vm.showSuccess = false;
        }, 3000);

      });
    };

    // Add a hash to a the caption
    this.addHashTag = function(hash){
      var hashes = vm.caption.match(regexp);
      if(!_.some(hashes, function(h){ return h === '#' + hash; } )){
        if(vm.caption.length !== 0){
          vm.caption += ' ';
        }
        vm.caption += '#' + hash;
      }
    };

    // To filter out used hashes
    this.usedHashes = function(hash){
      var usedHashes = vm.caption.match(regexp) || [];
      return !_.contains(usedHashes, '#' + hash.name);
    };

    /**
     * EVENTS
     */

    $scope.$on('$locationChangeStart', function(event, next, current) {
      if(GoliveService.status === 'connected' && !confirm("You have live, you really want to leave this page?")) {
        event.preventDefault();
      }
    });

    $scope.$on('$destroy', function() {
      if(GoliveService.status === 'connected'){
        // Stop golive session if the user navigates away
        $scope.ctrl.stop();
      }

      // Close the modal when navigating away
      modalInstance.close();
    });

    // Hashtags
    $scope.$watch('vm.caption', function(a){
      if(a){
        // sets warning for long caption
        if (a.length > 17) {
          vm.captionWarning = true;
        } else {
          vm.captionWarning = false;
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

    $scope.$on('liveStreamStopped', function(event, data) {
      $scope.ctrl.stop(data.goback);

    });

    $scope.gotoTerms = function() {
      modalInstance.close();
      $state.go('terms');
    };

    $scope.gotoProfile = function() {
      modalInstance.close();
      $state.go('profile.streams');
    };

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
    GeolocationService.getCurrent().then(function(location){
    	if(location){
	    	vm.nearChannels =	Channel.searchByLocation(location.lat, location.lng);
	    }
    });

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
