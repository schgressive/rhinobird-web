'use strict';

angular.module('rhinobird.controllers')
  .controller('UserCtrl', function ($scope, $stateParams, user) {

    $scope.self = $scope;

    // Expose the user in the scope
    $scope.user = user;

    // Get the user timeline
    $scope.timeline = user.timeline.$collection();
    $scope.timeline.getNextPage();
  });
