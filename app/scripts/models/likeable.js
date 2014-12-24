'use strict';

angular.module('rhinobird.models')
  .factory('Likeable', function ($restmod) {
    return $restmod.model(null, {

      "toggleLike": function() {
        if (this.liked) {
          this.unlike();
        } else {
          this.like();
        }
      },

      unlike: function() {
        var obj = this;
        this.$send({method: 'DELETE', url: this.$url() + '/like'}).$then(function() {
          obj.liked = false;
          obj.likes = obj.likes - 1;
        });
      },

      like: function() {
        var obj = this;
        return this.$send({method: 'POST', url: this.$url() + '/like'}).$then(function() {
          obj.liked = true;
          obj.likes = obj.likes + 1;
        });

      }
    });
  });

