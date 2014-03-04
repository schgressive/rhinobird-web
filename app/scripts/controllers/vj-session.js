'use strict';

angular.module('peepoltv.controllers')
  .controller('VjSessionCtrl', function ($scope, channel, user, VjService, Stream) {

    $scope.self = $scope;

    // The current channel
    $scope.channel = channel;

    // The current user
    $scope.user = user;

    // The streams in the user vj pool
    $scope.vjstreams = user.vjstreams.$fetch();

    // Create a socket data connection with the user token
    VjService.startListening(user.vjToken).then(function(){
      VjService.socket.stream.addEventListener('stream-data', function(streamEvent){
        $scope.$apply(function(){
          if(streamEvent.msg.event === 'active-stream-change'){
            var streamToActivate = _.find($scope.vjstreams, function(s){return s.streamId === streamEvent.msg.params.streamId;});
            streamToActivate.active = true;
            $scope.currentStream = streamToActivate.stream;
          }

          if(streamEvent.msg.event === 'pool-change'){
            var action = streamEvent.msg.params.action;
            var streamId = streamEvent.msg.params.streamId;

            if(action === 'add'){
              Stream.$find(streamId).$then(function(s){
                var vjStream = $scope.vjstreams.$build();
                vjStream.streamId = s.id;
                vjStream.active = false;
                vjStream.token = s.token;
                vjStream.stream = s;
              });
            }

            if(action === 'remove'){
              var streamToRemove = _.find($scope.vjstreams, function(vs){
                return vs.streamId === streamId;
              });
              $scope.vjstreams.$remove(streamToRemove);
            }
          }
        });
      });
    });

    // Set the active stream as the current stream in the scope
    $scope.$on('licode-video-created', function(event, stream){

      // Only when there is no current stream
      if(!$scope.currentStream){
        var eventStream = _.find($scope.vjstreams, function(s){return s.stream.licode.getID() === stream.getID();});

        // Choose the one that's active to play in the main screen
        if(eventStream.active){
          // Set the current stream
          $scope.currentStream = eventStream.stream;
        }
      }
    });
  });
