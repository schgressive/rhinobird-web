'use strict';

angular.module('peepoltvApp')
  .controller('GoliveCtrl', ['$scope', 'streamService', 'geolocation', function ($scope, streamService, geolocation) {

    // Change the location when is changed
    $scope.$on('locationChanged', function (event, parameters) {

      // Save the coords in the scope
      $scope.coords = parameters.coordinates;

      // Get the user media and show the feedback
      $scope.localStream = Erizo.Stream({audio: true, video: true, data: true});
      $scope.localStream.init();

      $scope.localStream.addEventListener('access-accepted', function () {
        console.log('Access to webcam and microphone granted');

        // Show the video
        $scope.localStream.show('myBroadcast');

        // Set a readyToGo state
        $scope.readyToGo = true;
      });

      $scope.localStream.addEventListener('access-denied', function() {
        console.log('Access to webcam and microphone rejected');
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
        thumb: $scope.localStream.getVideoFrameURL()
      };
      streamService.resource.new(streamData, function(data){


        $scope.room = Erizo.Room({token: data.token});
        $scope.room.connect();
        $scope.room.addEventListener('room-connected', function() {
          // Publish stream to the room
          $scope.room.publish($scope.localStream);
        });

        $scope.room.addEventListener('stream-added', function(event) {
          if ($scope.localStream.getID() === event.stream.getID()) {
            console.log('Published!!!');
          }
        });
      });
    };
  }]);
