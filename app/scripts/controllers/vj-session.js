'use strict';

angular.module('rhinobird.controllers')
  .controller('VjSessionCtrl', function ($scope, vj) {

    $scope.self = $scope;

    // The vj
    $scope.vj = vj;

    // The current user
    $scope.user = vj.user;

  });
