'use strict';

angular.module('peepoltv')
  .controller('DefaultActionsCtrl', function ($scope, AuthService) {
    $scope.user = AuthService.user;

    $scope.login = function(){
      AuthService.askLogin();
    };

    $scope.logout = function(){
      AuthService.logout();
    };
  });
