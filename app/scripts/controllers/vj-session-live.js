'use strict';

angular.module('rhinobird.controllers')
  .controller('VjSessionLiveCtrl', function ($scope, vj, user, VjService, Stream) {

    $scope.self = $scope;

    // The current user
    $scope.user = user;

    // The vj
    $scope.vj = vj;

    // The picks
    $scope.picks = vj.picks.$fetch();

    // The currently playing pick
    $scope.currentPick = null;

    // Create a socket data connection with the user token
    VjService.startListening(vj.token).then(function(){
      VjService.socket.stream.addEventListener('stream-data', function(data){
        $scope.$apply(function(){
          if(data.msg.event === 'active-pick-changed'){

	          var pickToActivate = vj.picks.getById(data.msg.params.pickId);
            pickToActivate.active = true;

            if(!$scope.currentAudioPick){
	            _.each($scope.picks, function(_pick){
	              // Mute them
                _pick.stream.isMuted = true;
	            });

              pickToActivate.stream.isMuted = false;
            }

            $scope.currentPick = pickToActivate.stream;
          }

          if(data.msg.event === 'active-audio-pick-changed'){

            var pickToFixAudio = vj.picks.getById(data.msg.params.pickId);

						if(data.msg.params.activeAudio){
	            _.each($scope.picks, function(_pick){
	              // Mute them
                _pick.activeAudio = false;
	            });

              pickToFixAudio.stream.isMuted = false;
            }

            pickToFixAudio.activeAudio = data.msg.params.activeAudio;
            pickToFixAudio.stream.isMuted = !data.msg.params.activeAudio;
            $scope.currentAudioPick = (data.msg.params.activeAudio)? pickToFixAudio : undefined;
          }

          if(data.msg.event === 'picks-changed'){
            var action = data.msg.params.action;
            var pickId = data.msg.params.pickId;

            if(action === 'add'){
              var pickToAdd = vj.picks.$find(pickId);
              $scope.picks.$add(pickToAdd);
            }

            if(action === 'remove'){
              var pickToRemove = vj.picks.getById(pickId);
              $scope.picks.$remove(pickToRemove);
            }
          }
        });
      });
    });

    // Set the active pick as the current pick in the scope
    $scope.$on('licode-video-created', function(event, stream){
      var pickEvent = _.find($scope.picks, function(s){return s.stream.licode && s.stream.licode.getID() === stream.getID();});
      var anyFixed = _.any($scope.picks, function(s){ return s.activeAudio; });

      // Only when there is no current stream
      if(!$scope.currentPick){

        // Choose the one that's active to play in the main screen
        if(pickEvent.active){
          // Set the current stream
          $scope.currentPick = pickEvent.stream;
        }

      }

      // Set the fixed audio if there is any
      if(pickEvent.activeAudio){
        $scope.currentAudioPick = pickEvent.stream;
      };

      // Unmute the stream
      if(anyFixed){
	      pickEvent.stream.isMuted = !pickEvent.activeAudio;
      }
      else{
	      pickEvent.stream.isMuted = !pickEvent.active;
	    }
    });
  });
