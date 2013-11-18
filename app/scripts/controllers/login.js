'use strict';

angular.module('peepoltvApp')
  .controller('LoginCtrl', function ($scope, AuthService) {
    $scope.loginUser = function(){

      var userData = $scope.logUser;

      AuthService.login(userData).then(function(e){

        // Validate form
        $scope.loginForm.password.$setValidity('invalid-pw', true);

        // Close modal form
        $scope.$close();
      },
      function(error){
        // Some error
        $scope.loginForm.password.$setValidity('invalid-pw', false);
      });
    };
  });
