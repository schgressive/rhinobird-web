'use strict';

angular.module('rhinobird.services')
  .service('VjService', function VjService($q, Vj, channelSocket) {

    var _self = this;

    // Whether the vj service is live
    this.live = false;

    // Intanciate a socket
    this.socket = null;

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
        _self.socket.broadcastEvent('picks-changed');

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
    this.startBroadcast = function(streams, currentStreamId, fixedAudioStreamId, channelName, coords){

      var vj_object = { channelName: channelName };

      // Add geoloation data if it's available
      if(coords && coords.lng && coords.lat){
        angular.extend(vj_object, {
          lng: coords.lng,
          lat: coords.lat
        });
      }

      // Create a new vj
      _self.vj = Vj.$create(vj_object);

      _self.vj.$then(function(vj){

        // create the socked channel
        socketConnect(vj.token, 'outbound').then(function(){
          // Set the vj in live state
          _self.vj.status = 'live';
          _self.vj.$save();
        });

        // Add the streams to the vj
        _.each(streams, function(s){

          // Find the stream that is playing
          var isCurrent = s.id === currentStreamId;

          // Find the fixed audio stream
          var isfixedAudio = s.id === fixedAudioStreamId;

          // Add the stream to the vj
          _self.addPickByStreamId(s.id, isCurrent, isfixedAudio);

        });
      });

      return _self.vj;
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
      if(this.live){
        // Disconnect the sockec channel
        _self.socket.disconnect();

        // Set the vj status as pending
        _self.vj.status = 'pending';
        _self.vj.$save();

        this.live = false;
      }
    };

    // Add a new pick to the vj
    this.addPickByStreamId = function(streamId, active, fixedAudio){

      var pick = _self.vj.picks.$build();
      pick.active = active || false;
      pick.fixedAudio = fixedAudio || false;
      pick.streamId = streamId;
      pick.$save().$then(function(){

        if(_self.socket){
          // Broadcast the event
          _self.socket.broadcastEvent('picks-changed', {
            action: 'add',
            pickId: pick.id
          });
        }

      });

      return pick.$promise;
    };

    // Remove a pick from the vj
    this.removePickByStreamId = function(streamId){

      // Remove the pick from the vj
      var pick = _self.vj.picks.getByStreamId(streamId);
      pick.$destroy();

      if(_self.socket){
        // Broadcast the event
        _self.socket.broadcastEvent('picks-changed', {
          action: 'remove',
          pickId: pick.id
        });
      }

      return pick.$promise;
    };

    // Activate a pick from the vj
    this.activatePickByStreamId = function(streamId){
      // Set the pick as active
      var pick = _self.vj.picks.getByStreamId(streamId);
      pick.activate();

      // Broadcast the event
      if(_self.socket){
        _self.socket.broadcastEvent('active-pick-changed', {
          pickId: pick.id
        });
      }

      return pick.$promise;
    };

    // Choose a pick to solo it's audio
    this.fixAudioPickByStreamId = function(streamId){

      if(!streamId){ return; }

      // Set the pick audio as active
      var pick = _self.vj.picks.getByStreamId(streamId);
      pick.fixAudio();

      // Broadcast the event
      if(_self.socket){
        _self.socket.broadcastEvent('active-audio-pick-changed', {
          pickId: pick.id,
          fixedAudio: true
        });
      }

      return pick.$promise;
    };

    // Choose a pick to unsolo it's audio
    this.unfixAudioPickByStreamId = function(streamId){

      if(!streamId){ return; }

      // Set the pick audio as inactive
      var pick = _self.vj.picks.getByStreamId(streamId);
      pick.unfixAudio();

      // Broadcast the event
      if(_self.socket){
        _self.socket.broadcastEvent('active-audio-pick-changed', {
          pickId: pick.id,
          fixedAudio: false
        });
      }

      return pick.$promise;
    };
  });
