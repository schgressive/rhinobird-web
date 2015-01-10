'use strict';

angular.module('rhinobird.models')
  .factory('User', function ($restmod) {
    return $restmod.model('users', {
      streams: { hasMany: 'Stream'},
      vjs: { hasMany: 'Vj' },
      timeline: {hasMany: 'Timeline'},

      'getProfilePic': function() {
        return this.avatar || this.photo;
      }
    },
    function() {
      this.on('after-save', function() {
        var user = this;
        //remove the password after signup
        delete user.password;
      });

      this.setPrimaryKey('username');
    });
  });
