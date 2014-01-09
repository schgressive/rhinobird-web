'use strict';

angular.module('peepoltv')
  .factory('Password', function ($restmod) {
    return $restmod.model('users/password');
  });

