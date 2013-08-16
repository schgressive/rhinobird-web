'use strict';

angular.module('peepoltvApp')
  .service('authService', function authService($resource, $q, settings) {
    var resource = $resource(settings.apiHost + '/sessions', {}, {
      'register': {
        method: 'POST',
        params: {},
        url: settings.apiHost + '/registration',
        withCredentials: true
      },
      'login': {
        method: 'POST',
        params: {},
        withCredentials: true
      },
      'status': {
        method: 'GET',
        params: {},
        withCredentials: true
      },
      'logout':{
        method: 'DELETE',
        params: {},
        withCredentials: true
      }
    });

    // Public API here
    return {
      resource: resource,
      user: {},
      statusResolve: function(){
        var deferred = $q.defer();

        resource.status({}, function(r){
          if(r){
            deferred.resolve(r);
          }
          else
          {
            deferred.reject();
          }
        }, function(){
          deferred.reject();
        });
        return deferred.promise;
      }
    };
  });
