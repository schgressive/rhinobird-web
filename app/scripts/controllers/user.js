'use strict';

angular.module('peepoltv.controllers')
  .controller('UserCtrl', function ($scope, $stateParams, user) {

    $scope.self = $scope;

    // Expose the user in the scope
    $scope.user = user;

    // Get the user streams
    $scope.streams = user.streams.$fetch();
  });
