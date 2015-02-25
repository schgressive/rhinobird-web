'use strict';

angular.module('rhinobird.controllers')
  .controller('DefaultActionsCtrl', function ($scope, AuthService, $state) {
    $scope.user = AuthService.user;

    $scope.showVideo = $state.includes('main');

    $scope.login = function(){
      AuthService.askLogin();
    };

    $scope.logout = function(){
      AuthService.logout();
    };
  });
