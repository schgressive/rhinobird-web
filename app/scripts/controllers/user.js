'use strict';

angular.module('rhinobird.controllers')
  .controller('UserCtrl', function ($scope, $state, user) {

    var vm = this;

    $scope.self = $scope;
    $scope.user = user;

    init()


    function init() {
      // Go to default tab
      $state.go('user.streams');
      // Get the user timeline
      $scope.timeline = user.timeline.$collection();
      $scope.timeline.getNextPage();
      user.followers.$fetch();
      user.following.$fetch();

      // Get a live stream if it has
      var streams = user.streams.$search({live: true, per_page: 1}).$then(function (streams) {
        $scope.stream = streams[0];
      });
    }

  });
