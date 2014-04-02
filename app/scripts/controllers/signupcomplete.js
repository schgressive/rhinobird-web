'use strict';

angular.module('rhinobird.controllers')
  .controller('SignupCompleteCtrl', function ($scope, AuthService, User) {

    $scope.saveInfo = function() {
      var user = User.$build({id: 'current'})
      if ($scope.username) {
        user.username = $scope.username;
      }
      if ($scope.email) {
        user.email = $scope.email;
      }
      user.$save();

      $scope.$close();
    }

  });
