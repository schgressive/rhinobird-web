'use strict';

angular.module('rhinobird.models')
  .factory('Password', function ($restmod) {
    return $restmod.model('users/password');
  });

