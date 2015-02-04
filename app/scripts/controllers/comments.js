'use strict';

angular.module('rhinobird.controllers')
  .controller('CommentsCtrl', function ($scope, CommentsService) {

    $scope.init = function(roomId) {
      $scope.roomId = roomId;
    };

    var stream = null;

    if ($scope.stream)
      stream = $scope.stream;
    else if ($scope.currentStream)
      stream = $scope.currentStream;
    else if ($scope.currentPick)
      stream = $scope.currentPick;
    else if ($scope.vm && $scope.vm.stream)
      stream = $scope.vm.stream;

    $scope.stream = stream;
    $scope.watchersCount = {};
    $scope.commentsCount = {};

    var onStats = function (stats) {
      $scope.watchersCount[stats.roomId] = stats.watchersCount;
      $scope.commentsCount[stats.roomId] = stats.commentsCount;
      $scope.$apply();
    };

    var roomId = $scope.roomId || (stream ? stream.id : null);

    if (!roomId) {
      console.log('WARNING: No Room ID or Stream to init comments');
      return false;
    }

    CommentsService.API.on('incomming-stats', onStats);
    CommentsService.API.joinStatsRoom(roomId);
    CommentsService.API.fetchStats(roomId);

    $scope.CommentsService = CommentsService;
  });

