'use strict';

angular.module('rhinobird.models')
  .factory('User', function ($restmod) {
    return $restmod.model('users', 'PagedModel', {
      streams: { hasMany: 'Stream'},
      vjs: { hasMany: 'Vj' },
      timeline: {hasMany: 'Timeline'},
      followers: {hasMany: 'User'},
      following: {hasMany: 'User'},

      '@getNextPage': function(){
        var page = this.$page || 0;
        if(!this.$pageCount || this.$page + 1 <= this.$pageCount){
          return this.$fetch({ page: page + 1 });
        }
        return this;
      },

      'getProfilePic': function() {
        return this.avatar || this.photo;
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
