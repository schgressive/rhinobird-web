'use strict';

angular.module('peepoltvApp')
  .factory('User', function ($restmod, settings) {
    return $restmod.model('users');
  });
