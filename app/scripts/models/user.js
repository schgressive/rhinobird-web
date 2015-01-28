'use strict';

angular.module('rhinobird.models')
  .factory('User', function ($restmod) {
    return $restmod.model('users', {
      streams: { hasMany: 'Stream'},
      vjs: { hasMany: 'Vj' },
      timeline: {hasMany: 'Timeline'},
      followers: {hasMany: 'User'},
      following: {hasMany: 'User'},

      'getProfilePic': function() {
        return this.avatar || this.photo || '/images/profile-default.svg';
      },
      $unfollow: function() {
        return this.$send({
          method: 'DELETE',
          url: this.$url() + '/followers/me',
          data: {}
        }, function(_data) { /* do somthing w data */ });
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
