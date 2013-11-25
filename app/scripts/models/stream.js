'use strict';

angular.module('peepoltvApp')
  .factory('Stream', function ($restmod, settings) {
    return $restmod.model('streams',
    {
      user: { hasOne: 'User' }
    },
    function(){
      this.classDefine('live', function(){
        return this.$search({ live: true, 'force_check': true });
      })
    });
  });
