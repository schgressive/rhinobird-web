'use strict';

angular.module('peepoltvApp')
  .controller('SignupCtrl', function ($scope, AuthService) {
    $scope.registerUser = function(){

      var userData = {
        user: $scope.regUser
      };

      AuthService.register(userData.user).then(function(e){
        $scope.$close();
        var user = e.user;
        AuthService.user.email = user.email;
        AuthService.user.name = user.name;
      },
      function(e){
        $scope.unknownError = false;
        if(angular.isObject(e.$response.data) && e.$response.data){
          var info = e.$response.data;

          //mark fields as valid = false if there's a need
          $scope.signupForm.email.$setValidity("taken", (angular.isUndefined(info.email) || info.email[0].match(/taken/) == null));
          $scope.signupForm.email.$setValidity("invalid", (angular.isUndefined(info.email) || info.email[0].match(/invalid/) == null));
          $scope.signupForm.password.$setValidity("minlength", (angular.isUndefined(info.password) || info.password[0].match(/short/) == null));
          $scope.signupForm.username.$setValidity("taken", (angular.isUndefined(info.username) || info.username[0].match(/taken/) == null));
        }
        else{
          $scope.unknownError = true;
        }
      });
    };
  });
