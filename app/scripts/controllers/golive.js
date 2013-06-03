'use strict';

angular.module('peepoltvApp')
  .controller('GoliveCtrl', ['$scope', 'Streams', 'geolocation', function ($scope, Streams, geolocation) {

    // Change the location when is changed
    $scope.$on('locationChanged', function (event, parameters) {

      // Save the coords in the scope
      $scope.coords = parameters.coordinates;

      // Get the user media and show the feedback
      window.localStream = Erizo.Stream({audio: true, video: true, data: true});
      localStream.init();

      localStream.addEventListener("access-accepted", function () {
        console.log("Access to webcam and microphone granted");

        // Show the video
        localStream.show("myBroadcast");

        // Set a readyToGo state
        $scope.readyToGo = true;
      });

      localStream.addEventListener('access-denied', function(event) {
        console.log("Access to webcam and microphone rejected");
      });

    });

    // Get current location
    geolocation();

    $scope.onAir = function(){
      var streamData = {
        title: $scope.title,
        desc: $scope.desc,
        lng: $scope.coords.longitude,
        lat: $scope.coords.latitude,
        thumb: localStream.getVideoFrameURL()
      };
      Streams.new(streamData, function(data){


        window.room = Erizo.Room({token: data.token});
        room.connect();
        room.addEventListener("room-connected", function(event) {
          // Publish stream to the room
          room.publish(localStream);
        });

        room.addEventListener("stream-added", function(event) {
          if (localStream.getID() === event.stream.getID()) {
            console.log("Published!!!");
          }
        });
      });
    }


  }]);
