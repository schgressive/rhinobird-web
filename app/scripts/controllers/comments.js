'use strict';

angular.module('rhinobird.controllers')
  .controller('CommentsCtrl', function ($scope, CommentsService) {

    var stream = null;

    if ($scope.stream)
      stream = $scope.stream;
    else if ($scope.currentStream)
      stream = $scope.currentStream;
    else if ($scope.vm && $scope.vm.stream)
      stream = $scope.vm.stream;
    else
      return false;

    $scope.stream = stream;
    $scope.watchersCount = {};
    $scope.commentsCount = {};

    var onStats = function (stats) {
      $scope.watchersCount[stats.roomId] = stats.watchersCount;
      $scope.commentsCount[stats.roomId] = stats.commentsCount;
      $scope.$apply();
    };

    var roomId = stream.id;

    CommentsService.API.on('incomming-stats', onStats);
    CommentsService.API.joinStatsRoom(roomId);
    CommentsService.API.fetchStats(roomId);

    $scope.CommentsService = CommentsService;
  });

