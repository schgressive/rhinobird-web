'use strict';

angular.module('peepoltvApp')
  .factory('Stream', function ($restmod, settings) {
    return $restmod(settings.apiHost + '/streams');
  });
