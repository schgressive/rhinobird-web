'use strict';

angular.module('peepoltv.models')
  .factory('User', function ($restmod, SyncMask) {
    return $restmod.model('users', {
      streams: { hasMany: 'Stream'},
      stream_ids: {
        ignore: SyncMask.ENCODE
      }
    },
    function() {
      this.on('after-save', function() {
        var user = this;
        //remove the password after signup
        delete user.password;
      });
    });
  });
