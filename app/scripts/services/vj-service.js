'use strict';

angular.module('peepoltv.services')
  .service('VjService', function VjService($q, VjStream, channelSocket) {

    var _self = this;

    // Whether the vj service is live
    this.live = false;

    // Intanciate a socket
    this.socket = null;

    /**
     * Get the stream from the pool
     * @param  {stream} stream
     * @return {stream}
     */
    var getPoolStream = function(stream){
      return _.find(_self.pool, function(vjs){
        return vjs.stream.id === stream.id;
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
        _self.socket.broadcastEvent('pool-change');

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

      // Get the current user vj pool of streams
      // Could have streams from a previously initiated session in the same channel
      _self.pool = VjStream.$search({ 'force_check': true }).$then(function(){

        // If there are streams in the pool, connect to the socket
        if(_self.pool.length > 0){
          socketConnect(_.first(_self.pool).token, 'outbound');
        }

        // From the streams currently connected from the channels,
        // Find the ones that arent in the pool.
        // var streamsToAdd = _.filter(streams, function(stream){
        //   return _self.pool.$indexOf(getPoolStream(stream)) < 0;
        // });

        // Add the streams to the pool
        _.each(streams, function(s, idx){

          // Find the stream that is playing
          var isCurrent = s.id === currentStreamId;

          // Find the fixed audio stream
          var isAudioActive = s.id === fixedAudioStreamId;

          // Add the stream to the pool
          _self.addStream(s, isCurrent, isAudioActive, channelName).then(function(_vjStream){

            // create the socked channel after the first stream is added
            if(!_self.live && idx === 0){
              socketConnect(_vjStream.token, 'outbound');
            }
          });

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
      _self.socket.disconnect();

      this.live = false;
    };

    // Add a new stream to the pool
    this.addStream = function(stream, active, audioActive, channelName){

      var addedStream = _self.pool.$build();
      addedStream.active = active || false;
      addedStream.audioActive = audioActive || false;
      addedStream.streamId = stream.id;
      addedStream.channelName = channelName;
      addedStream.$save();

      if(_self.socket){
        // Broadcast the event
        _self.socket.broadcastEvent('pool-change', {
          action: 'add',
          streamId: stream.id
        });
      }

      return addedStream.$promise;
    };

    // Remove a stream from the pool
    this.removeStream = function(stream){

      // Remove the stream from the pool
      var removedStream = getPoolStream(stream);
      removedStream.$pk = stream.id;
      removedStream.$destroy();

      if(_self.socket){
        // Broadcast the event
        _self.socket.broadcastEvent('pool-change', {
          action: 'remove',
          streamId: stream.id
        });
      }

      return removedStream.$promise;
    };

    // Activate a stream from the pool
    this.activateStream = function(stream){
      // Set the vj stream as active
      var activeStream = getPoolStream(stream);
      activeStream.$pk = stream.id;
      activeStream.active = true;
      activeStream.$save();

      // Broadcast the event
      if(_self.socket){
        _self.socket.broadcastEvent('active-stream-change', {
          streamId: stream.id
        });
      }

      return activeStream.$promise;
    };

    // Activate a stream from the pool
    this.setFixedAudioStream = function(stream){

      if(!stream){ return; }

      // Set the vj stream as active
      var fixedAudioStream = getPoolStream(stream);
      fixedAudioStream.$pk = stream.id;
      fixedAudioStream.audioActive = true;
      fixedAudioStream.$save();

      // Broadcast the event
      if(_self.socket){
        _self.socket.broadcastEvent('active-audio-stream-change', {
          streamId: stream.id
        });
      }

      return fixedAudioStream.$promise;
    };

    // Activate a stream from the pool
    this.unsetFixedAudioStream = function(stream){

      if(!stream){ return; }

      // Set the vj stream as active
      var fixedAudioStream = getPoolStream(stream);
      fixedAudioStream.$pk = stream.id;
      fixedAudioStream.audioActive = false;
      fixedAudioStream.$save();

      // Broadcast the event
      if(_self.socket){
        _self.socket.broadcastEvent('active-audio-stream-change', {
          streamId: stream.id
        });
      }

      return fixedAudioStream.$promise;
    };
  });
