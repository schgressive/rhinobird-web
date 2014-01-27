'use strict';

angular.module('peepoltv.models')
  .factory('Session', function ($restmod) {
    return $restmod.model('sessions', {
        user: { hasOne: 'User' }
      },
      function() {
        this.on('afterDestroy', function() {

          var session = this;

          // Delete all the custom properties
          this.$each(function(prop, key){
            if(key !== 'id' && key !== 'user'){
              delete session[key];
            }
          });

          // Delete the user custom properties
          this.user.$each(function(prop, key){
            delete session.user[key];
          });
        });

        this.on('afterSave', function(){
          var session = this;

          // Reset the id to current to be able to perform further actions
          this.id = 'current';

          delete session.password;
        });
      });

  });




