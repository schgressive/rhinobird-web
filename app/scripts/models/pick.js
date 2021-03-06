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
       * Fix the audio from the pick
       * @return {promise}
       */
      'fixAudio': function(){
        this.fixedAudio = true;
        return this.$save().promise;
      },

      /**
       * Deactivate the audio from the pick
       * @return {promise}
       */
      'unfixAudio': function(){
        this.fixedAudio = false;
        return this.$save().promise;
      },

      /**
       * Sync the state of the picks active and
       * fixedAudio properties
       */
      'syncLocalState': function(){
        var pick = this;

        if(this.$scope.$isCollection){

          _.each(this.$scope, function(_pick){

            // Skip if is the same stream
            if(_pick.stream.id == pick.stream.id) { return; }

            // Setting pick as active
            // Will deactivate former active stream
            if(pick.active && _pick.active){
              _pick.active = false;
            }

            // Setting the pick audio as active
            if(pick.fixedAudio){
              // Will deactivate former audio active stream
              if(_pick.fixedAudio){
                _pick.fixedAudio = false;
              }
            }
            // Setting the pick audio as inactive
            else{
              // Will activate back the active stream
              if(_pick.active){
                _pick.fixedAudio = true;
              }
            }
          });
        }
      },

      /**
       * After each pick is added to the collection
       * @param  {pick} pick    Vj pick
       */
      '~after-save': function(){
        this.syncLocalState();
      }
    });
  });
