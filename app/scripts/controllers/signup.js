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
        if(angular.isObject(e.data) && e.data.info){
          var info = e.data.info;

          //mark fields as invalid if there's a need
          $scope.signupForm.email.$setValidity("taken", (info.email && info.email[0].match(/taken/) == null));
          $scope.signupForm.password.$setValidity("minlength", (info.password && info.password[0].match(/short/) == null));
          $scope.signupForm.username.$setValidity("taken", (info.username && info.username[0].match(/taken/) == null));

          // flag for showing alerts(should be removed once we have inline error messages)
          $scope.alert = true;

        }
        else{
          $scope.alert = 'other';
        }
      });
    };
  });
