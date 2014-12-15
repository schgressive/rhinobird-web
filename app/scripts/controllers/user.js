'use strict';

angular.module('rhinobird.controllers')
  .controller('UserCtrl', function ($scope, $stateParams, user) {

    $scope.self = $scope;

    // Expose the user in the scope
    $scope.user = user;

    // Get the user timeline
    $scope.timeline = user.timeline.$collection();
    $scope.timeline.getNextPage();

    // Get a live stream if it has
    var streams = user.streams.$search({live: true, per_page: 1}).$then(function (streams) {
      $scope.stream = streams[0];
    });
  });
