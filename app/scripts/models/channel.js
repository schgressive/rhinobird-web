'use strict';

angular.module('peepoltvApp')
  .factory('Channel', function ($restmod) {
    return $restmod.model('channels', {
      streams: { hasMany: 'Stream' }
    });
  });
