'use strict';

angular.module('rhinobird.models')
  .factory('Pick', function ($restmod) {
    return $restmod.model('picks', {
      stream: { hasOne: 'Stream' },

      '@getById': function(pickId){
        return _.find(this, function(p){
          return p.id === pickId;
        });
      },

      /**
       * Get a pick by stream id
       * @param  {string} streamId The stream id the search for
       * @return {pick}            The pick the match
       */
      '@getByStreamId': function(streamId){
        return _.find(this, function(p){
          return p.streamId === streamId;
        });
      },

      /**
       * Activate the pick
       * @return {promise}
       */
      'activate': function(){
        this.active = true;
        return this.$save().promise;
      },

      /**
       * Activate the audio from the pick
       * @return {promise}
       */
      'activateAudio': function(){
        this.activeAudio = true;
        return this.$save().promise;
      },

      /**
       * After each pick is added to the collection
       * @param  {pick} pick    Vj pick
       */
      '~after-add': function(pick){
        var picks = this;

        // Add a hook the each element to mantain the active status
        // when a vj pick is set as active
        pick.$on('after-save', function(){
          _.each(picks, function(_pick){
            if(_pick.active && _pick.stream.id !== pick.stream.id){
              _pick.active = false;
            }

            if(_pick.audioActive && _pick.stream.id !== pick.stream.id){
              _pick.audioActive = false;
            }
          });
        });


      }
    });
  });
