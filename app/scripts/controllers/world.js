'use strict';

angular.module('rhinobird.controllers')

  .controller('WorldCtrl', function ($scope, Timeline) {

    // Expose the scope as self
    $scope.self = $scope;

    // Get the timeline
    $scope.timeline = Timeline.$collection();
    $scope.timeline.getNextPage();

  });
