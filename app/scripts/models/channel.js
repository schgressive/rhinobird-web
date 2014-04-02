'use strict';

angular.module('rhinobird.models')
  .factory('Channel', function ($restmod) {
    return $restmod.model('channels', {
      streams: { hasMany: 'Stream' }
    }, function(){
     this.classDefine('searchByLocation', function(lat, lng){
      // Payload
      var payload = {
        lat: lat,
        lng: lng
      }

      return this.$search(payload);
      });
    });
  });
