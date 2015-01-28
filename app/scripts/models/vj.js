'use strict';

angular.module('rhinobird.models')
  .factory('Vj', function ($restmod) {
    return $restmod.model('vjs', 'Likeable', {
      user: { hasOne: 'User' },
      channel: { hasOne: 'Channel' },
      picks: { hasMany: 'Pick' }
    });
  });
