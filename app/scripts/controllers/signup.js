'use strict';

angular.module('rhinobird.controllers')
  .controller('SignupCtrl', function ($scope, AuthService, mobileDetect, $timeout) {
    var vm = this;

    var isMobile = mobileDetect();
    vm.isMobile = isMobile;
    vm.signupSuccess = false;

    vm.registerUser = registerUser;

    function registerUser(signupForm) {
      var userData = {};
      angular.copy(vm.user, userData);
      userData.isMobile = vm.isMobile;

      AuthService.register(userData).then(function(user){
        vm.signupSuccess = true;
        AuthService.user.email = user.email;
        AuthService.user.name = user.name;

        // Auto close modal form after auto-sign-in
        AuthService.login(userData).then(function () {
          $scope.$close();
        });
      },
      function(e){
        vm.unknownError = false;
        if(angular.isObject(e.$response.data) && e.$response.data){
          var info = e.$response.data;

          //mark fields as valid = false if there's a need
          signupForm.email.$setValidity('taken', (angular.isUndefined(info.email) || info.email[0].match(/taken/) === null));
          signupForm.email.$setValidity('invalid', (angular.isUndefined(info.email) || info.email[0].match(/invalid/) === null));
          if (!angular.isUndefined(signupForm.password)) {
            signupForm.password.$setValidity('minlength', (angular.isUndefined(info.password) || info.password[0].match(/short/) === null));
            signupForm.password.$setValidity('match', (angular.isUndefined(info.password) || info.password[0].match(/match/) === null));
            signupForm.username.$setValidity('taken', (angular.isUndefined(info.username) || info.username[0].match(/taken/) === null));
          }
        }
        else{
          vm.unknownError = true;
        }
      });
    };
  });
