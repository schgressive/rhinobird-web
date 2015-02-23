'use strict';

angular.module('rhinobird.controllers')
  .controller('SignupCtrl', function ($scope, AuthService, mobileDetect, $timeout, ValidateUserResponse) {
    var vm = this;

    var isMobile = mobileDetect();
    vm.isMobile = isMobile;
    vm.signupSuccess = false;

    vm.registerUser = registerUser;

    function generateRandomUserData(userData) {
      var name = userData.email.match(/(^.*)@/);
      if (name != null)
        name = name[1];
      else
        name = "null";

      userData.name     = name;
      userData.username = name + sjcl.codec.hex.fromBits( sjcl.random.randomWords(8) ).slice(0,5);
      userData.password = sjcl.codec.hex.fromBits( sjcl.random.randomWords(8) );
      userData.password_confirmation = userData.password;

      return userData;
    }

    function registerUser(signupForm) {
      var userData = {};
      angular.copy(vm.user, userData);
      userData.isMobile = vm.isMobile;

      if (vm.isMobile)
        userData = generateRandomUserData(userData);

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
