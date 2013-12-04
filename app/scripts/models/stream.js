'use strict';

angular.module('peepoltvApp')
  .factory('Stream', function ($restmod, settings) {
    return $restmod.model('streams',
    {
      user: { hasOne: 'User' },
      isPlaying: { ignore: true }, // Whether is connected to licode server
      licode: { ignore: true } // The licode stream object
    },
    function(){
      this.classDefine('live', function(){
        return this.$search({ live: true, 'force_check': true });
      })
    });
  });
