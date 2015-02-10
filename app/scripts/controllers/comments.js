'use strict';

angular.module('rhinobird.controllers')
  .controller('CommentsCtrl', function ($scope, CommentsService) {

    $scope.init = function(roomId) {
      $scope.roomId = roomId;
      CommentsService.API.on('incomming-stats', onStats);
      CommentsService.API.joinStatsRoom(roomId);
      CommentsService.API.fetchStats(roomId);
    };

    $scope.watchersCount = {};
    $scope.commentsCount = {};

    var onStats = function (stats) {
      $scope.watchersCount[stats.roomId] = stats.watchersCount;
      $scope.commentsCount[stats.roomId] = stats.commentsCount;
      $scope.$apply();
    };
  });
