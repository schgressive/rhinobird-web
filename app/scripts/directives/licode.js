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
        var room, elementId;
        var licode = {
          stream: null,
          permissionsGranted: false
        };

        // Set an ID
        elementId = (scope.token !== '')? 'licode_' + JSON.parse(window.atob(scope.token)).tokenId : 'licode_' + (new Date()).getTime();
        element.attr('id', elementId);

        // Set video size
        element.css({
          'width': attrs.width,
          'height': attrs.height
        });

        // Set the model
        if(attrs.ngModel){
          scope.ngModel = licode;
        }

        // Initiate the stream (camera/mic permissions)
        if(attrs.flow === "outbound"){

          // Create the stream
          licode.stream = Erizo.Stream({audio: true, video: true, data: false});
          licode.stream.init();

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
