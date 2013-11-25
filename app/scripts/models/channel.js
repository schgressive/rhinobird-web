'use strict';

angular.module('peepoltvApp')
  .factory('Channel', function ($restmod, settings) {
    return $restmod.model('channels', {
      streams: { hasMany: 'Stream' }
    });
  });
