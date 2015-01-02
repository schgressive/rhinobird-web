'use strict';

angular.module('rhinobird.controllers')
  .controller('Comments', function ($scope, $rootScope, AuthService) {

    $scope.user = AuthService.getSession();
  });
