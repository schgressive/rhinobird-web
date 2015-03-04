'use strict';

angular.module('rhinobird.controllers')
  .controller('SignupCtrl', function ($scope, AuthService, mobileDetect, $timeout, ValidateUserResponse) {
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
        ValidateUserResponse.validate(signupForm, e)
        vm.unknownError = ValidateUserResponse.validate(signupForm, e);
      });
    };
  });
