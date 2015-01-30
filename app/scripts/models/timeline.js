'use strict';

angular.module('rhinobird.models')
  .factory('Timeline', function ($restmod, Vj, Stream, Repost) {
    return $restmod.model('timeline', 'PagedModel', {
      reposts: { hasMany: 'Repost'},
      /**
       * Get next page of streams
       * @return {collection} Stream Collection
       */
      '@getNextPage': function(){
        var page = this.$page || 0;
        if(!this.$pageCount || this.$page + 1 <= this.$pageCount){
          return this.$fetch({ page: page + 1 });
        }
        return this;
      },

      '~after-feed': function(raw){
        var timeline = this;

        if(timeline.resourceType === 'Stream'){
          timeline.resource = Stream.$buildRaw(raw.resource);
        }
        else if(timeline.resourceType === 'Vj'){
          timeline.resource = Vj.$buildRaw(raw.resource);
        }
        else if(timeline.resourceType === 'Repost'){
          timeline.resource = Repost.$buildRaw(raw.resource);
        }

        if (timeline.resource.status === 'live') {
          timeline.resource.$fetch();
        }
      }
    });
  });
