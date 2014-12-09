'use strict';

angular.module('rhinobird.directives')
  .directive('infiniteTimelineList', function () {

    function removeItem(timeline) {
      // make resource hidden by setting as pending
      timeline.resource.$destroy().$then(function() {
        timeline.resource.status = 'pending';
      });
    }

    return {
      templateUrl: '/views/templates/infinite-timeline-list.html',
      restrict: 'EA',
      scope: {
        timeline: '=',
        allowDelete: '='
      },
      link: function(scope) {
        scope.removeItem = removeItem;
      }
    };
  });
