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
        $scope.$close();
        var user = e.data.user;
        authService.user.email = user.email;
        authService.user.name = user.name;
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
