'use strict';

angular.module('peepoltvApp')
  .factory('User', function ($restmod, settings) {
    return $restmod.model('users',
      function() {
        this.afterSave(function() {
          var user = this;
          //remove the password after signup
          delete user.password;
        });
      });
  });
