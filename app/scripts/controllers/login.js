'use strict';

angular.module('peepoltvApp')
  .controller('LoginCtrl', function ($scope, authService) {
    $scope.loginUser = function(){

      var userData = $scope.logUser;

      authService.resource.login(userData, function(e){
        $scope.loginForm.password.$setValidity('invalid-pw', true);
        // Close modal form
        $scope.$close();

        authService.user.email = e.email;
        authService.user.name = e.name;

      },
      function(error){
        // Some error
        $scope.loginForm.password.$setValidity('invalid-pw', false);
      });
    };
  });
