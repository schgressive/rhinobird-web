'use strict';

angular.module('rhinobird.models')
  .factory('Repostable', function ($restmod) {
    return $restmod.model(null, {

      repost: function() {
        var obj = this;
        if(this.reposted) return;

        return this.$send({method: 'POST', url: this.$url() + '/reposts'}).$then(function() {
          obj.reposted = true;
          obj.repost_count = obj.repost_count + 1;
        });

      }
    });
  });

