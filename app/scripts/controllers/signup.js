'use strict';

angular.module('peepoltvApp')
  .controller('SignupCtrl', function ($scope, authService) {
    $scope.registerUser = function(){

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
        $scope.unknownError = false;
        if(angular.isObject(e.data) && e.data.info){
          var info = e.data.info;

          //mark fields as valid = false if there's a need
          $scope.signupForm.email.$setValidity("taken", (angular.isUndefined(info.email) || info.email[0].match(/taken/) == null));
          $scope.signupForm.password.$setValidity("minlength", (angular.isUndefined(info.password) || info.password[0].match(/short/) == null));
          $scope.signupForm.username.$setValidity("taken", (angular.isUndefined(info.username) || info.username[0].match(/taken/) == null));
        }
        else{
          $scope.unknownError = true;
        }
      });
    };
  });
