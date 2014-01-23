'use strict';

angular.module('peepoltv.models')
  .factory('Stream', function ($restmod, SyncMask) {
    return $restmod.model('streams', 'PagedModel',
    {
      user: { hasOne: 'User' },
      isConnected: { ignore: true }, // Whether is connected to licode server
      isMuted: { ignore: true }, // Whether is muted
      isProjected: { ignore: true }, // Whether is viewed in the canva
      licode: { ignore: true }, // The licode stream object
      startedOn: { ignore: SyncMask.ENCODE },
      thumbs: { ignore: SyncMask.ENCODE },
      type: { ignore: SyncMask.ENCODE },
      token: { ignore: SyncMask.ENCODE },
      properties: {
        ignore: SyncMask.ENCODE,
        decode: function(_data){
          return angular.extend(_data, {
            'marker-size': 'medium',
            'marker-color': '#A954F5',
            'marker-symbol': 'cinema'
          });
        }
      }
    },
    function(){
      /**
       * Only get live stream
       * @return {collection} Collection of streams
       */
      this.classDefine('live', function(force){
        // Live
        var params = {
          live: true
        };

        // Force check
        if(force){
          angular.extend(params, {
            force: true
          });
        }

        return this.$search(params);
      });

      /**
       * Get next page of streams
       * @return {collection} Stream Collection
       */
      this.classDefine('getNextPage', function(){
        var page = this.$page || 0;
        if(!this.$pageCount || this.$page + 1 <= this.$pageCount){
          return this.$fetch({ page: page + 1 });
        }
        return this;
      });

      /**
       * Get the streams collection as a GeoJSON feature collection
       * @return {collection} Feature Collection
       */
      this.classDefine('asGeoJSON', function(){
        return {
          type: 'FeatureCollection',
          features: this
        };
      });
    });
  });
