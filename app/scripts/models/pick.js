'use strict';

angular.module('rhinobird.models')
  .factory('Pick', function ($restmod, SyncMask) {
    return $restmod.model('picks', {
      stream: { hasOne: 'Stream' }
    }, function(){

      // this.setPrimaryKey('streamId');

      this.on('after-add', function(pick){
        var collection = this;

        // Add the stream id to the vj stream
        // pick.streamId = pick.stream.id;

        // Add a hook the each element to mantain the active status
        // when a vj pick is set as active
        pick.$on('after-save', function(){
          _.each(collection, function(_pick){
            if(_pick.active && _pick.stream.id !== pick.stream.id){
              _pick.active = false;
            }

            if(_pick.audioActive && _pick.stream.id !== pick.stream.id){
              _pick.audioActive = false;
            }
          });
        });


      });
    });
  });
