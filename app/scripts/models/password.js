'use strict';

angular.module('peepoltvApp')
  .factory('Password', function ($restmod) {
    return $restmod.model('users/password');
  });

