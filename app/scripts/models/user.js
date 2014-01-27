'use strict';

angular.module('peepoltv.models')
  .factory('User', function ($restmod) {
    return $restmod.model('users', {
      streams: { hasMany: 'Stream'}
    },
    function() {
      this.on('afterSave', function() {
        var user = this;
        //remove the password after signup
        delete user.password;
      });
    });
  });
