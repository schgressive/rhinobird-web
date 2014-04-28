'use strict';

angular.module('rhinobird.services')
  .service('VjService', function VjService($q, Vj, channelSocket) {

    var _self = this;

    // Whether the vj service is live
    this.live = false;

    // Intanciate a socket
    this.socket = null;

    /**
     * Get the pick from the vj
     * @param  {stream} stream
     * @return {stream}
     */
    var getPick = function(stream){
      return _.find(_self.vj.picks, function(p){
        return p.streamId === stream.id;
      });
    };


    /**
     * Create the room based on the token
     * @param  {string} token Licode token
     * @param  {string} flow  Direction of the connection
     */
    var socketConnect = function(token, flow){
      var deferred = $q.defer();

      _self.socket = channelSocket(token);
      _self.socket.flow = flow;

      _self.socket.connect().then(function(){
        _self.live = true;

        // Broadcast the event
        _self.socket.broadcastEvent('picks-change');

        deferred.resolve();

      });

      return deferred.promise;
    };

    /**
     * The vj will setup a socket connection and start the broadcast
     * Is needed at least one stream in the pool to start de connection
     * @param  {array} streams         array of streams to add to the pool
     * @param  {string} currentStreamId Id of the stream that is currently selected
     * @param  {string} channelName     Set the channel name for the stream_pool
     */
    this.startBroadcast = function(streams, currentStreamId, fixedAudioStreamId, channelName){

      // Create a new vj
      _self.vj = Vj.$create({ channelName: channelName}).$then(function(vj){

        // create the socked channel
        socketConnect(vj.token, 'outbound').then(function(){
          // Set the vj in live state
          _self.vj.status = 'live';
          _self.vj.$save();
        });

        // Add the streams to the vj
        _.each(streams, function(s, idx){

          // Find the stream that is playing
          var isCurrent = s.id === currentStreamId;

          // Find the fixed audio stream
          var isactiveAudio = s.id === fixedAudioStreamId;

          // Add the stream to the vj
          _self.addPick(s, isCurrent, isactiveAudio);

        });
      });

    };

    this.startListening = function(token){
      var deferred = $q.defer();

      socketConnect(token, 'inbound').then(function(){
        deferred.resolve();
      });

      return deferred.promise;
    };

    // The vj will close the socket connection and stop the broadcast
    this.stopBroadcast = function(){
      // Disconnect the sockec channel
      _self.socket.disconnect();

      // Set the vj status as pending
      _self.vj.status = 'pending';
      _self.vj.$save();

      this.live = false;
    };

    // Add a new pick to the vj
    this.addPick = function(stream, active, activeAudio){

      var addedPick = _self.vj.picks.$build();
      addedPick.active = active || false;
      addedPick.activeAudio = activeAudio || false;
      addedPick.streamId = stream.id;
      addedPick.$save();

      if(_self.socket){
        // Broadcast the event
        _self.socket.broadcastEvent('picks-change', {
          action: 'add',
          streamId: stream.id
        });
      }

      return addedPick.$promise;
    };

    // Remove a pick from the vj
    this.removePick = function(stream){

      // Remove the pick from the vj
      var removedPick = getPick(stream);
      removedPick.$destroy();

      if(_self.socket){
        // Broadcast the event
        _self.socket.broadcastEvent('picks-change', {
          action: 'remove',
          streamId: stream.id
        });
      }

      return removedPick.$promise;
    };

    // Activate a pick from the vj
    this.activatePick = function(stream){
      // Set the pick as active
      var activePick = getPick(stream);
      activePick.active = true;
      activePick.$save();

      // Broadcast the event
      if(_self.socket){
        _self.socket.broadcastEvent('active-stream-change', {
          streamId: stream.id
        });
      }

      return activePick.$promise;
    };

    // Activate a pick from the vj
    this.setFixedAudioPick = function(stream){

      if(!stream){ return; }

      // Set the pick audio as active
      var fixedAudioPick = getPick(stream);
      fixedAudioPick.activeAudio = true;
      fixedAudioPick.$save();

      // Broadcast the event
      if(_self.socket){
        _self.socket.broadcastEvent('audio-mute-change', {
          streamId: stream.id,
          activeAudio: true
        });
      }

      return fixedAudioPick.$promise;
    };

    // Activate a stream from the pool
    this.unsetFixedAudioPick = function(stream){

      if(!stream){ return; }

      // Set the pick audio as inactive
      var fixedAudioPick = getPick(stream);
      fixedAudioPick.activeAudio = false;
      fixedAudioPick.$save();

      // Broadcast the event
      if(_self.socket){
        _self.socket.broadcastEvent('audio-mute-change', {
          streamId: stream.id,
          activeAudio: false
        });
      }

      return fixedAudioPick.$promise;
    };
  });
