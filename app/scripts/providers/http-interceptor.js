'use strict';

angular.module('rhinobird.providers')
  .provider('HttpInterceptor', function HttpInterceptorProvider($injector) {

    this.$get = function ($q, $injector) {

      var rootScope = $injector.get('$rootScope');

      return {
        'request': function(config) {
          rootScope.$broadcast('request-success');
          return config;
        },

       'requestError': function(rejection) {
          rootScope.$broadcast('request-error');
          return $q.reject(rejection);
        },

        'response': function(response) {
          rootScope.$broadcast('response-success');
          return response;
        },

       'responseError': function(rejection) {
          rootScope.$broadcast('response-error');
          return $q.reject(rejection);
        }
      }
    }
});
