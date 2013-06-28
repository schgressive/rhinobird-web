'use strict';

angular.module('peepoltvApp')
  .controller('StreamCtrl', function ($scope, streamService, $routeParams) {

    // Get the stream
    $scope.stream = streamService.resource.get({streamId: $routeParams.streamId}, function(){

      // Show the stream
      var stream;
      // Get the erizo room based on the stream id
      var room = Erizo.Room({token: $scope.stream.token});

      room.addEventListener('room-connected', function(roomEvent) {
        // Subscribe to the stream
        room.subscribe(roomEvent.streams[0]);
      });

      room.addEventListener('stream-subscribed', function(streamEvent) {
        stream = streamEvent.stream;

        stream.show('stream');

      });


      // Connect to the room
      room.connect();
    });




  });
