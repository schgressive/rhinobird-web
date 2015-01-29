'use strict';

angular.module('rhinobird.models')
  .factory('Repost', function ($restmod) {
    return $restmod.model('repost', {
      timeline: { hasOne: 'Timeline'}
    });
  });

