'use strict';

angular.module('peepoltv')
  .factory('Channel', function ($restmod) {
    return $restmod.model('channels', {
      streams: { hasMany: 'Stream' }
    });
  });
