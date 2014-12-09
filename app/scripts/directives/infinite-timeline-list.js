'use strict';

angular.module('rhinobird.directives')
  .directive('infiniteTimelineList', function () {
    return {
      templateUrl: '/views/templates/infinite-timeline-list.html',
      restrict: 'EA',
      scope: {
        timeline: '=',
        allowDelete: '='
      },
      link: function postLink() {
      }
    };
  });
