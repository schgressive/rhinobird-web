'use strict';

var host = 'http://peepoltv.apiary.io';

angular.module('apiServices', ['ngResource'])
  .factory('Streams', ['$resource', function($resource) {
    return $resource(host + '/streams/:streamId', {}, {
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
  }]);
