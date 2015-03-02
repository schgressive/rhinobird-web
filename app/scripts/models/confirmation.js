'use strict';

angular.module('rhinobird.models')
  .factory('Confirmation', function ($restmod) {
    return $restmod.model('users/confirmation');
  });

