'use strict';

angular.module('peepoltv.models')
  .factory('Stream', function ($restmod, SyncMask) {
    var StatusMessages = {
      "pending": "stream under production",
      "vj-live": "live VJ session",
      "vj-archive": "archived VJ session",
      "live": "happening live!"
    };

    return $restmod.model('streams', 'PagedModel',
    {
      user: { hasOne: 'User' },
      isAudioFixed: { ignore: true, init: false }, // Whether it's audio is using for a channel
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
            'force_check': true
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
       * Returns a formated message for a given current status
       */
      this.define('getStatusMessage', function() {
        return StatusMessages[this.status];
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
