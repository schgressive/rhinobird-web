'use strict';

angular.module('peepoltvApp')
  .factory('Password', function ($restmod, settings) {
    return $restmod.model('users/password');
  });

