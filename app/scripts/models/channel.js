'use strict';

angular.module('rhinobird.models')
  .factory('Channel', function ($restmod) {
    return $restmod.model('channels', {
      streams: { hasMany: 'Stream' },

      /**
       * Search channels by location
       * @param  {int} lat Latitdue
       * @param  {int} lng Longitude
       * @return {array}   Collection of channels filter by location
       */
      '@searchByLocation': function(lat, lng){
        // Payload
        var payload = {
          lat: lat,
          lng: lng
        }

        return this.$search(payload);
      }
    });
  });
