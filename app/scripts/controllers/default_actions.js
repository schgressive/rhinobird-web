'use strict';

angular.module('peepoltvApp')
  .controller('DefaultActionsCtrl', function ($scope, authService) {
    $scope.user = authService.user;

    $scope.login = function(){
      authService.askLogin();
    }

    $scope.logout = function(){
      authService.logout();
    };
  });
