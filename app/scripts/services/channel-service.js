'use strict';

angular.module('peepoltvApp')
  .service('channelService', function channelService($resource, settings) {
    var cache = {};
    var resource = $resource(settings.apiHost + '/channels/:channelId', {}, {
      get: {
        method: 'GET',
        params:{
          channelId: '@channelId'
        },
        transformResponse: function(data){
          data = JSON.parse(data);
          if(data.streams.length > 0){
            data.streams = data.streams.reverse();
          }
          return data;
        },
        withCredentials: true
      },
      'search': {
        method:'GET',
        params: {},
        isArray: true,
        transformResponse: function(data){
          data = JSON.parse(data);
          data = _.map(data, function(c){
            c.streams = c.streams.reverse();
            return c;
          });
          return data;
        },
        withCredentials: true
      },
    });

    // Public API here
    return {
      resource: resource,
      resolve: function(channelId){

        var deferred = $q.defer();

        // Do not reload the stream if we are trying to get
        // the same stream as current stream stored in the navigation service
        if(parseInt(channelId, 10) === cache.id){
          deferred.resolve(cache);
        }
        else{
          resource.get({channelId: channelId}, function(r){
          // Get more info the stream based on the url
            //angular.extend($scope.stream, r);
            if(r){
              cache = r;
              deferred.resolve(r);
            }
            else
            {
              deferred.reject();
            }

          });
        }
        return deferred.promise;
      }

    };
  });
