'use strict';

angular.module('rhinobird.directives')
  .directive('featureOverlay', function (CommentsService, AuthService) {

    function link (scope, element, attrs) {

      scope.roomId = scope.stream.id;
      scope.user = AuthService.user;

      scope.watchersCount = {};
      scope.commentsCount = {};

      CommentsService.API.on('incomming-stats', function (stats) {
        scope.watchersCount[stats.roomId] = stats.watchersCount;
        scope.commentsCount[stats.roomId] = stats.commentsCount;
        scope.$apply();
      });

      CommentsService.API.joinStatsRoom(scope.roomId);
      CommentsService.API.fetchStats(scope.roomId);
    }

    return {
      templateUrl: '/views/snippets/feature-overlay.html',
      scope: {
        stream: '='
      },
      link: link
    };
  })
