'use strict';

angular.module('rhinobird.models')
  .factory('Vj', function ($restmod) {
    return $restmod.model('vjs', {
      channel: { hasOne: 'Channel' },
      picks: { hasMany: 'Pick' }
    });
  });
