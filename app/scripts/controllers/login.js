'use strict';

angular.module('peepoltv')
  .controller('LoginCtrl', function ($scope, AuthService) {
    $scope.loginUser = function(){

      var userData = $scope.logUser;

      AuthService.login(userData).then(function(){

        // Validate form
        $scope.loginForm.password.$setValidity('invalid-pw', true);

        // Close modal form
        $scope.$close();
      },
      function(){
        // Some error
        $scope.loginForm.password.$setValidity('invalid-pw', false);
      });
    };
  });
