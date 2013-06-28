'use strict';

angular.module('peepoltvApp')
  .factory('streamService', ['$resource', '$q', 'settings', function($resource, $q, settings) {

    var cache = {};
    var resource = $resource(settings.apiHost + '/streams/:streamId', {}, {
      get: {
        method: 'GET',
        params:{
          clientId: '@clientId'
        }
      },
      'search': {
        method:'GET',
        params: {},
        isArray: true
      },
      'new': {
        method: 'POST',
        params: {}
      }
    });

    // Public API here
    return {
      resource: resource,
      resolve: function(streamId){

        var deferred = $q.defer();

        // Do not reload the stream if we are trying to get
        // the same stream as current stream stored in the navigation service
        if(parseInt(streamId, 10) === cache.id){
          deferred.resolve(cache);
        }
        else{
          resource.get({streamId: streamId}, function(r){
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
  }]);
