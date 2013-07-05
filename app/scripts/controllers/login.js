'use strict';

angular.module('peepoltvApp')
  .controller('LoginCtrl', function ($scope, authService) {
    $scope.loginUser = function(){

      // Reset the alerts
      $scope.alert = null;

      var userData = $scope.logUser;

      authService.resource.login(userData, function(e){
        $scope.$parent.loginModalInit = false;
        authService.user.email = e.email;
        authService.user.name = e.name;

      },
      function(){
        // Some error
        $scope.alert = 'other';
      });
    };
  });
