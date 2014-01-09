'use strict';

angular.module('peepoltv.models')
  .factory('Channel', function ($restmod) {
    return $restmod.model('channels', {
      streams: { hasMany: 'Stream' }
    });
  });
