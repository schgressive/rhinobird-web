'use strict';

angular.module('rhinobird.models')
  .factory('Vj', function ($restmod) {
    return $restmod.model('vjs', 'Likeable', {
      channel: { hasOne: 'Channel' },
      picks: { hasMany: 'Pick' }
    });
  });
