'use strict';

angular.module('rhinobird.models')
  .factory('Vj', function ($restmod) {
    var vjModel = $restmod.model('vjs', 'Likeable', 'Repostable', {
      user: { hasOne: 'User' },
      channel: { hasOne: 'Channel' },
      picks: { hasMany: 'Pick' },

      '~after-feed': function(raw){
        var vj = this;
        if (vj.source) {
          vj.source = vjModel.$buildRaw(vj.source);
        }
      },
    });
    return vjModel;
  });
