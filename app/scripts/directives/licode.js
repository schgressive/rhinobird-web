'use strict';

angular.module('licode', [])
  .directive('licode', function () {
    return {
      restrict: 'EA',
      replace: true,
      template: '<div></div>',
      scope: {
        ngModel: '=',
        token: '@'
      },
      link: function postLink(scope, element, attrs) {

        // This is the public API
        var licode = {

          // The current licode stream
          stream: null,

          // Whether the user has given camera permission
          permissionsGranted: false,

          multiSources: null,
          cycleSource: function(){
            stopStream();

            var nextIndex = (_.indexOf(videoSources, currentSource) + 1) % videoSources.length;
            startStream(videoSources[nextIndex]);
          }
        };

        // Expose the publich api
        if(attrs.ngModel){
          scope.ngModel = licode;
        }

        /////////////
        // Private //
        /////////////

        var videoSources, currentSource;
        var room, elementId;

        // Set an ID
        elementId = (scope.token !== '')? 'licode_' + JSON.parse(window.atob(scope.token)).tokenId : 'licode_' + (new Date()).getTime();
        element.attr('id', elementId);

        // Set video size
        element.css({
          'width': attrs.width,
          'height': attrs.height
        });

        /**
         * Start the stream and add the event handlers
         * Alse set some states
         * @param  {SourceInfo} videoSource The video source used the get the video track
         */
        var startStream = function(videoSource){
          currentSource = videoSource;
          var videoConstrain = {
            optional: [
              {
                sourceId : videoSource.id
              }
            ]
          };

          licode.stream = Erizo.Stream({audio: true, video: videoConstrain, data: false});

          // Show the stream if persmission are accepted
          licode.stream.addEventListener('access-accepted', function () {
            console.log('Access to webcam and microphone granted');

            // Set permission status
            scope.$apply(function(){
              licode.permissionsGranted = true;
            });

            licode.stream.show(elementId);
            licode.stream.player.video.muted = true;
          });

          licode.stream.addEventListener('access-denied', function() {
            console.log('Access to webcam and microphone rejected');

            // Set permission status
            scope.$apply(function(){
              licode.permissionsGranted = false;
            });
          });

          licode.stream.init();
        };

        // Stop the current stream
        var stopStream = function(){
          licode.stream.removeEventListener('access-accepted');
          licode.stream.removeEventListener('access-denied');
          licode.stream.close();

          licode.permissionsGranted = false;
        };

        // Initiate the stream (camera/mic permissions)
        if(attrs.flow === "outbound"){

          // Get video sources
          MediaStreamTrack.getSources(function(sources){

            // Store just the video ones
            videoSources = _.filter(sources, function(s){
              return s.kind === 'video';
            });

            licode.multiSources = (videoSources.length > 1);

            // Create the stream
            startStream(videoSources[0]);
          });

        }

        scope.$watch('token', function(value, oldValue){
          console.log("Token changed: ", value, oldValue);
          // Disconnect if exist a room and it's connected
          if(room && room.state === 2){
            room.disconnect();
          }

          // Return if not token defined
          if(!value){
            return;
          }

          // Create the new room
          try {
            room = Erizo.Room({token: value});
            room.connect();
          } catch (e){
            console.log("Invalid token");
            return;
          }

          room.addEventListener('room-disconnected', function(roomEvent) {
            // Remove the room when disconnected
            room = null;
          });

          // Connected
          room.addEventListener('room-connected', function(roomEvent) {
            if(attrs.flow === "outbound"){
              // Stream added to the rrom
              room.addEventListener('stream-added', function(event) {
                if (licode.stream.getID() === event.stream.getID()) {


                }
              });

              // Publish stream to the room
              room.publish(licode.stream);
            }
            else if(attrs.flow === "inbound"){

              if(roomEvent.streams.length < 1){
                console.log("invalid stream");
                return;
              }

              // Stream subscribed
              room.addEventListener('stream-subscribed', function(streamEvent) {
                licode.stream = streamEvent.stream;
                licode.stream.show(elementId);
              });

              // Subscribe to the first stream in the room stream
              room.subscribe(roomEvent.streams[0]);
            }
          });
        });
      }
    };
  });
