'use strict';

angular.module('peepoltvApp')
  .controller('DefaultActionsCtrl', function ($scope, AuthService) {
    $scope.user = AuthService.user;

    $scope.login = function(){
      AuthService.askLogin();
    }

    $scope.logout = function(){
      AuthService.logout();
    };
  });
