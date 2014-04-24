'use strict';

angular.module('rhinobird.directives')
  .directive('streamCarousel', function ($timeout) {
    return {
      templateUrl: '/views/templates/stream-carousel.html',
      restrict: 'EA',
      scope: {
        streams: '=',
        currentStream: '=',
        fixedAudioStream: '='
      },
      link: function postLink(scope, element, attrs) {

        var owl = $('.owl-carousel', element);

        // Set the self scope reference
        scope.self = scope;

        // Change the main stream
        scope.changeStream = function(stream){
          scope.currentStream = stream;
        };

        // Change the main stream
        scope.setAsFixedAudio = function(stream, e){
          e.stopPropagation();

          if(!scope.fixedAudioStream || stream.id !== scope.fixedAudioStream.id){
            // Set the stream
            scope.fixedAudioStream = stream;
          }
          else{
            scope.fixedAudioStream = undefined;
          }

        };

        // Watch for the currentStreams change
        scope.$watch('currentStream', function(stream){
          if(stream){
            // Prepare all the videos
            _.each(scope.streams, function(_stream){
              if(_stream.isConnected){

                // Mute them all only if there isn't a fixed audio stream
                if(!scope.fixedAudioStream){
                  _stream.isMuted = true;
                }
                // Reset projected
                _stream.isProjected = _stream.id === stream.id;
              }
            });

            // Unmute the current stream only if there isn't a fixed audio stream
            if(!scope.fixedAudioStream){
              stream.isMuted = false;
            }

            // Trigger an event saying that we should show a new stream
            scope.$emit('stream-carousel-stream-changed', stream);
          }
        });

        // Watch for the fixedAudioStream change
        scope.$watch('fixedAudioStream', function(stream, oldvalue){
          // Prepare all the videos
          _.each(scope.streams, function(_stream){
            if(_stream.isConnected){

              // Mute them all
              _stream.isMuted = true;
            }
          });

          // Unmute the current fixed audio stream or the current stream
          if(stream){
            stream.isMuted = false;
            stream.isAudioFixed = true;
          }
          else {
            // When there is no stream selected as audio fixed
            // Set the curren stream as unmuted
            if(scope.currentStream){
              scope.currentStream.isMuted = false;
            }
          }

          // Set the previously selected stream as not audio fixed
          if(oldvalue){
            oldvalue.isAudioFixed = false;
          }

          // Trigger an event saying that we should show a new stream
          scope.$emit('stream-carousel-audiostream-changed', stream, oldvalue);
        });

        // Watch if the streams collection change
        scope.$watchCollection('streams', function(s){
          if(!s || s.length === 0) { return; }

          // Apply the owl slider
          // Note: timeout is used as a hack to be sure the the owl plugin is applied
          // after the dom elements are created by the ng-repeat
          $timeout(function(){

            // Initialize the carousel
            owl.owlCarousel({
              items: 4,
              itemsDesktop : false,
              itemsDesktopSmall : false,
              itemsTablet: false,
              itemsMobile : [767,3],
              pagination: false,
              navigation: true,
              scrollPerPage: true,
              afterAction : afterAction
            });
          });

        });

        // destroy carousel to avoid bug when ngrepeat runs before the owl destroy method
        scope.$on('stream-carousel-updated', function() {

            var owlInstance = owl.data('owlCarousel');
            if (!angular.isUndefined(owlInstance)) {
              owlInstance.destroy();
            }

        });

        // When a stream is added or removed
        scope.$on('licode-stream-status-changed', function(event, params){

          // When the status changed to removed
          if(params.status === 'removed' && params.stream){
            removeStream(params.stream.getID());
          }
        });

        var triggerStreamEvent = function(eventName, stream){
          var status = {
            action: eventName,
            stream: stream
          };

          scope.$emit('stream-carousel-changed', status);
        };

        // Update owl carrowsel status
        var afterAction = function(){
          var owlScope = this;

          $timeout(function(){
            // Disconnect the connected streams that are not visible
            _.each(scope.streams, function(stream, key){
              var isVisible = _.contains(owlScope.visibleItems, key);

              if(!isVisible && stream.isConnected && !stream.isProjected && !stream.isAudioFixed){
                stream.isConnected = false;

                // Trigger the stream removed
                triggerStreamEvent('remove', stream);
              }
            });

            // Connect the visible items
            connectVisibleStreams(owlScope.visibleItems);
          });
        };

        var connectVisibleStreams = function(visibleItems){

          var streams = _.filter(scope.streams, function(s){ return !s.ignoreFromCarousel; });

          // Connect the streams that become visible
          // based on the visible indexes passed by the carrousel though the visibleItems param
          _.each(visibleItems, function(i){
            var stream = streams[i];
            if(!stream){ return; }

            if(!stream.isConnected){
              // This will connect the streams that aren't connected
              // but the are becoming visible
              // Update the token
              stream.$fetch().$then(function(){
                // Only try to connect if the refreshed stream
                // has a valid token
                if(stream.token !== null){
                  stream.isConnected = true;
                  triggerStreamEvent('add', stream);
                }
                // Remove the stream from the carousel
                else{
                  removeStream(stream.streamId, true);
                }

              });
            }

            // Ensure the visible streams are playing
            if(stream.licode){
              stream.licode.player.video.play();
            }
          });
        };

        var removeStream = function(streamId, forceRemove){

          // Filter out the streams that where disconnected and removed
          var streams = _.filter(scope.streams, function(s){ return !s.ignoreFromCarousel; });

          // The stream to remove
          var streamToRemove = _.find(streams, function(s){return s.streamId === streamId;});
          var indexToRemove = _.indexOf(streams, streamToRemove);

          // Is the stream to remove currently playing
          var isCurrent = scope.currentStream && streamToRemove.id === scope.currentStream.id;

          // Remove stream
          if(indexToRemove >= 0 && (streamToRemove.isConnected || forceRemove)){
            // The owl carouse instance
            var owlScope = owl.data('owlCarousel');

            // remove it from carousel
            owlScope.removeItem(indexToRemove);

            // mark stream as ignored
            streamToRemove.ignoreFromCarousel = true;

            // Trigger the stream removed
            triggerStreamEvent('remove', streamToRemove);

            // connect new streams if new stream becomes visible
            connectVisibleStreams(owlScope.visibleItems);

            // If is the selected one, set the current in null
            if(isCurrent){
              scope.currentStream = undefined;
            }
          }
        };
      }
    };
  });
