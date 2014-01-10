'use strict';

angular.module('peepoltv.directives')
  .directive('infiniteStreamList', function () {
    return {
      templateUrl: '/views/templates/infinite-stream-list.html',
      restrict: 'EA',
      scope: {
        streams: '='
      },
      link: function postLink(scope, element, attrs) {
      }
    };
  });
