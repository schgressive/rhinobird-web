'use strict';

angular.module('peepoltv.controllers')
  .controller('DefaultActionsCtrl', function ($scope, AuthService) {
    $scope.user = AuthService.user;

    $scope.login = function(){
      AuthService.askLogin();
    };

    $scope.logout = function(){
      AuthService.logout();
    };
  });
