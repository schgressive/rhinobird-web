'use strict';

angular.module('rhinobird.controllers')
  .controller('GoliveCtrl', function ($scope, $modal, $state, $rootScope, $document, settings, session,
                                      Stream, GeolocationService, CameraService, GoliveService, $timeout, Channel,
                                     OpenAndWatch, FullscreenService, isMobile, DeviceDetector) {

		$scope.user = session.user;

    /**
     * VARIABLES
     */
    var vm = {}; // Define viewmodel
    var regexp = new RegExp('#([^\\s|^#]+)','g'); // Hashtag regex
    var modalInstance; // The modal dialog
    var streamLive = false;

    /**
     * SCOPE
     */
    $scope.vm = vm; // Expose the viewmodel in the scope
    $scope.ctrl = this; // Expose the controller
    $scope.vm.showSuccess = false;
    $scope.vm.chromeNeedsUpdate = DeviceDetector.chromeNeedsUpdate();

    // Boot controller
    init();

    // The the caption for the stream
    vm.caption = '';

    // Camera service
    vm.camera = CameraService;

    // Sharing Options
    vm.sharingOptions = {
      shareTwitter: $scope.user.shareTwitter,
      shareFacebook: $scope.user.shareFacebook,
      archive: true
    }

    // Golive service
    vm.goliveService = GoliveService;

    // The stream
    vm.stream = null;

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
        } else {
          coordsPayload = {
            lng: 0,
            lat: 0
          };
        }
      }

      // Add captions
      captionPayload = vm.caption;

      // Start the broadcast in the golive service
      streamLive = true;
      var the_stream = GoliveService.startBroadcast(captionPayload, coordsPayload, vm.sharingOptions );
        the_stream.then(function(data) {
          $scope.vm.stream = vm.goliveService.stream;
        })
    };

    // Stop the current broadcast
    this.stop = function(goback){
      // Only cancel if theres no stream operation pending
      if (vm.goliveService.stream && !vm.goliveService.stream.$pending && vm.goliveService.stream.status == "live") {
        streamLive = false;
        // Stop the broadcast in the golive service
        GoliveService.stopBroadcast().then(function(){

          // Go back
          if(goback){
            $state.go('profile');
          }

        });
      }

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

    // Fullscreen action
    this.showFullScreen = function () {
      FullscreenService.toggleFullscreen($('.mainWrapper')[0]);
    }

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

    this.shareWhatsapp = function() {
      var uri = "whatsapp://send?text=";
      var user = session.user.$pk;
      var currentUrl = $state.href("user",{userName: user}, {absolute: true});
      var text = "|LIVE NOW| ";
      uri = uri + text + encodeURIComponent(currentUrl);
      window.open(uri, "_blank");
    }


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
      closeModal();
    });

    // Hashtags
    $scope.$watch('vm.caption', function(a){
      if(a){
        vm.charsLeft = 120 - a.length;

        var hashes = a.match(regexp);
        vm.channels = _.map(hashes, function(c){
          return c.replace(settings.channelCleanedRegex, '');
        });
      }
    });

    $scope.$on('golive', function() {
      if(!isMobile)
        openGoliveModal();
    });

    $scope.$on('liveStreamStopped', function(event, data) {
      $scope.ctrl.stop(data.goback);
    });

    $scope.gotoTerms = function() {
      closeModal();
      $state.go('terms');
    };

    $scope.gotoHome = function() {
      closeModal();
      $state.go('main');
    };

    // When the stream gets published
    $scope.$on('licode-stream-status-changed', function(event, params){
      if(params.status === 'added'){
        $timeout(function() {
          vm.connected = true;
        }, 3000);

        // Update the stream id
        var payload = {
          streamId: params.stream.getID()
        };
        GoliveService.updateStream(payload, true).then(function(){
          // Close the modal
          closeModal();
        });
      }
    });

    function geolocationCallback(location) {
      if(location){
        vm.nearChannels =	Channel.searchByLocation(location.lat, location.lng);
        // Update stream's location
        if (streamLive && vm.useGeolocation) {
          GoliveService.updateStream({lat: location.lat,lng: location.lng });
        }
      }
    };

    function closeModal() {
      if (modalInstance) {
        modalInstance.close();
      }
    }

    function openGoliveModal(){
      modalInstance = $modal.open({
        backdrop: 'static',
        templateUrl: '/views/modals/golive-modal.html',
        scope: $scope
      });
    };

    function init() {
      GeolocationService.getCurrent().then(geolocationCallback);
      if (!isMobile) {
        openGoliveModal();
      }
    }

  });
