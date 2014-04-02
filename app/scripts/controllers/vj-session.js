'use strict';

angular.module('rhinobird.controllers')
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
          console.info(streamEvent.msg);
          if(streamEvent.msg.event === 'active-stream-change'){

          	var streamToActivate = _.find($scope.vjstreams, function(s){return s.streamId === streamEvent.msg.params.streamId;});
            streamToActivate.active = true;

            if(!$scope.fixedAudioStream){
	            _.each($scope.vjstreams, function(_vjstream){
	              // Mute them
                _vjstream.stream.isMuted = true;
	            });

              streamToActivate.stream.isMuted = false;
            }

            $scope.currentStream = streamToActivate.stream;
          }

          if(streamEvent.msg.event === 'audio-mute-change'){

            var streamToFixAudio = _.find($scope.vjstreams, function(s){return s.streamId === streamEvent.msg.params.streamId;});

						if(streamEvent.msg.params.audioActive){
	            _.each($scope.vjstreams, function(_vjstream){
	              // Mute them
                _vjstream.audioActive = false;
	            });

              streamToFixAudio.stream.isMuted = false;
            }

            streamToFixAudio.audioActive = streamEvent.msg.params.audioActive;
            streamToFixAudio.stream.isMuted = !streamEvent.msg.params.audioActive;
            $scope.fixedAudioStream = (streamEvent.msg.params.audioActive)? streamToFixAudio : undefined;
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
      var eventStream = _.find($scope.vjstreams, function(s){return s.stream.licode && s.stream.licode.getID() === stream.getID();});
      var anyFixed = _.any($scope.vjstreams, function(s){ return s.audioActive; });

      // Only when there is no current stream
      if(!$scope.currentStream){

        // Choose the one that's active to play in the main screen
        if(eventStream.active){
          // Set the current stream
          $scope.currentStream = eventStream.stream;
        }

      }

      // Set the fixed audio if there is any
      if(eventStream.audioActive){
      	$scope.fixedAudioStream = eventStream.stream;
      };

      // Unmute the stream
      if(anyFixed){
      	eventStream.stream.isMuted = !eventStream.audioActive;
      }
      else{
	      eventStream.stream.isMuted = !eventStream.active;
	    }
    });
  });
