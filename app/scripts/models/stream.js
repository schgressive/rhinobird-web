'use strict';

angular.module('peepoltv.models')
  .factory('Stream', function ($restmod, SyncMask) {
    return $restmod.model('streams', 'PagedModel',
    {
      user: { hasOne: 'User' },
      isPlaying: { ignore: true }, // Whether is connected to licode server
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
      this.classDefine('live', function(){
        return this.$search({ live: true, 'force_check': true });
      });

      /**
       * Get next page of streams
       * @return {[type]} [description]
       */
      this.classDefine('getNextPage', function(){
        var page = this.$page || 0;
        if(!this.$pageCount || this.$page + 1 <= this.$pageCount){
          return this.$fetch({ page: page + 1 });
        }
        return this;
      });

      this.classDefine('asGeoJSON', function(){
        return {
          type: 'FeatureCollection',
          features: this
        };
      });
    });
  });
