'use strict';

angular.module('peepoltvApp')
  .factory('Stream', function ($restmod, SyncMask) {
    return $restmod.model('streams',
    {
      user: { hasOne: 'User' },
      isPlaying: { ignore: true }, // Whether is connected to licode server
      licode: { ignore: true }, // The licode stream object
      startedOn: { ignore: SyncMask.ENCODE },
      thumbs: { ignore: SyncMask.ENCODE },
      type: { ignore: SyncMask.ENCODE },
      token: { ignore: SyncMask.ENCODE }
    },
    function(){
      this.classDefine('live', function(){
        return this.$search({ live: true, 'force_check': true });
      });
    });
  });
