'use strict';

angular.module('peepoltv.models')
  .factory('Password', function ($restmod) {
    return $restmod.model('users/password');
  });

