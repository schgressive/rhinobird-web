'use strict';

angular.module('rhinobird.controllers')
  .controller('VjSessionCtrl', function ($scope, vj, user) {

    $scope.self = $scope;

    // The current user
    $scope.user = user;

    // The vj
    $scope.vj = vj;
  });
