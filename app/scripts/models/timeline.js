'use strict';

angular.module('rhinobird.models')
  .factory('Timeline', function ($restmod, Vj, Stream) {
    return $restmod.model('timeline', 'PagedModel', {
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

        if(timeline.type == 'Stream'){
          timeline.resource = Stream.$buildRaw(raw)
        }
        else if(timeline.type == 'Vj'){
          timeline.resource = Vj.$buildRaw(raw)
        }
      }
    });
  });
