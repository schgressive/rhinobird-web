'use strict';

angular.module('rhinobird.models')
  .factory('Channel', function ($restmod) {
    return $restmod.model('channels', 'PagedModel', {
      streams: { hasMany: 'Stream' },

      '@getNextPage': function(){
        var page = this.$page || 0;
        if(!this.$pageCount || this.$page + 1 <= this.$pageCount){
          return this.$fetch({ page: page + 1 });
        }
        return this;
      },

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
        };

        return this.$search(payload);
      }
    });
  });
