'use strict';

angular.module('peepoltvApp')
  .controller('SignupCtrl', function ($scope, authService) {
    $scope.registerUser = function(){

      // Reset the alerts
      $scope.alert = null;

      var userData = {
        user: $scope.regUser
      };

      authService.resource.register(userData, function(e){
        //authService.cookies.setToken(e.data['auth_token']);
      },
      function(e){
        if(angular.isObject(e.data) && e.data.info.email.length){
          if(e.data.info.email[0] === 'has already been taken'){
            // The email is already taken
            $scope.alert = 'email';
          }
          else{
            $scope.alert = 'other';
          }
        }
        else{
          $scope.alert = 'other';
        }
      });
    };
  });
