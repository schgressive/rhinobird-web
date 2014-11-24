'use strict';

angular.module('rhinobird.controllers')
  .controller('VjSessionLiveCtrl', function ($scope, vj, user, VjService) {

    $scope.self = $scope;

    // The current user
    $scope.user = user;

    // The vj
    $scope.vj = vj;

    // The picks
    $scope.picks = vj.picks.$refresh();

    // The currently playing pick
    $scope.currentPick = null;

    // Create a socket data connection with the user token
    VjService.startListening(vj.token).then(function(){
      VjService.socket.stream.addEventListener('stream-data', function(data){
        $scope.$apply(function(){
          if(data.msg.event === 'active-pick-changed'){

	          var pickToActivate = vj.picks.getById(data.msg.params.pickId);
            pickToActivate.active = true;
            pickToActivate.syncLocalState();

            if(!$scope.currentAudioPick){
	            _.each($scope.picks, function(_pick){
	              // Mute them
                _pick.stream.isMuted = true;
	            });

              pickToActivate.stream.isMuted = false;
            }

            $scope.currentPick = pickToActivate;
          }

          if(data.msg.event === 'active-audio-pick-changed'){

            var pickToFixAudio = vj.picks.getById(data.msg.params.pickId);
            pickToFixAudio.syncLocalState();

            _.each($scope.picks, function(_pick){
              // Mute them
              _pick.fixedAudio = false;
            });

            // Unmute the fixed pick
            pickToFixAudio.stream.isMuted = !data.msg.params.fixedAudio;
            // Mute the active pick
            if($scope.currentPick){
              $scope.currentPick.stream.isMuted = data.msg.params.fixedAudio;
            }

            pickToFixAudio.fixedAudio = data.msg.params.fixedAudio;
            pickToFixAudio.stream.isMuted = !data.msg.params.fixedAudio;
            $scope.currentAudioPick = (data.msg.params.fixedAudio)? pickToFixAudio : null;
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
      var anyFixed = _.any($scope.picks, function(s){ return s.fixedAudio; });

      // Only when there is no current stream showing in video
      if(!$scope.currentPick){

        // Choose the one that's active to play in the main screen
        if(pickEvent.active){
          // Set the current stream
          $scope.currentPick = pickEvent;
        }

      }

      // Set the fixed audio if there is any
      if(pickEvent.fixedAudio){
        $scope.currentAudioPick = pickEvent;
      }

      // Unmute the stream
      if(anyFixed){
	      pickEvent.stream.isMuted = !pickEvent.fixedAudio;
      }
      else{
	      pickEvent.stream.isMuted = !pickEvent.active;
	    }
    });
  });
