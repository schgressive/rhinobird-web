'use strict';

angular.module('rhinobird.controllers')
  .controller('VjSessionLiveCtrl', function ($scope, user, VjService, $stateParams, $interval) {

    var POLLING_TIME = 10000;

    $scope.self = $scope;

    // The current user
    $scope.user = user;

    // The vj
    $scope.vj = null;

    // The picks
    $scope.picks = [];

    // The currently playing pick
    $scope.currentPick = null;

    // Channel name
    $scope.channelName = $stateParams.channelName;

    // The room id for comments
    $scope.roomId = $scope.channelName + '-' + user.username + '-vj-offline';

    // Streaming in progress indicator
    $scope.streamingInProgress = false;

    // Check if there are vjs sessions to subscribe
    var checkVj = function () {
      if ($scope.streamingInProgress)
        return false;

      user.vjs.$search({ 'channel_name': $stateParams.channelName, live: true }).$then(function (vjs) {
        if (!vjs.length > 0)
          return false;

        var vj = vjs[0];
        $scope.vj = vj;
        $scope.picks = vj.picks.$refresh();
        $scope.roomId = $scope.channelName + '-' + user.username + '-' + vj.id;

        VjService.startListening(vj.token).then(subscribeStream);

        $scope.streamingInProgress = true;
      });
    };

    // check now and periodicaly check for vj every 10 seconds
    checkVj();
    var polling = $interval(checkVj, POLLING_TIME);

    // Subscribe to a vj session
    var subscribeStream = function () {
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

            $scope.currentPick = pickToActivate.stream;
          }

          if(data.msg.event === 'active-audio-pick-changed'){

            var pickToFixAudio = vj.picks.getById(data.msg.params.pickId);
            pickToFixAudio.syncLocalState();

            if(data.msg.params.fixedAudio){
              _.each($scope.picks, function(_pick){
                // Mute them
                _pick.fixedAudio = false;
              });

              pickToFixAudio.stream.isMuted = false;
            }

            pickToFixAudio.fixedAudio = data.msg.params.fixedAudio;
            pickToFixAudio.stream.isMuted = !data.msg.params.fixedAudio;
            $scope.currentAudioPick = (data.msg.params.fixedAudio)? pickToFixAudio : undefined;
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
    };

    // Set the active pick as the current pick in the scope
    $scope.$on('licode-video-created', function(event, stream){
      var pickEvent = _.find($scope.picks, function(s){return s.stream.licode && s.stream.licode.getID() === stream.getID();});
      var anyFixed = _.any($scope.picks, function(s){ return s.fixedAudio; });

      // Only when there is no current stream
      if(!$scope.currentPick){

        // Choose the one that's active to play in the main screen
        if(pickEvent.active){
          // Set the current stream
          $scope.currentPick = pickEvent.stream;
        }
      }

      // Set the fixed audio if there is any
      if(pickEvent.fixedAudio){
        $scope.currentAudioPick = pickEvent.stream;
      }

      // Unmute the stream
      if(anyFixed){
        pickEvent.stream.isMuted = !pickEvent.fixedAudio;
      }
      else{
        pickEvent.stream.isMuted = !pickEvent.active;
      }
    });

    $scope.$on('$destroy', function() {
      $interval.cancel(polling);
    });

    $scope.willPlayback = function () {
      return $scope.picks && $scope.picks.length > 0 && !$scope.currentPick;
    };
  });
