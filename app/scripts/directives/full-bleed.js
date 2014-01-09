'use strict';

angular.module('peepoltv')
  .directive('fullBleed', function ($window) {
    return function(scope, element){
      var w = angular.element($window);
      var e = angular.element(element);

      // Make the element move backwards
      e.css({
        'z-index': -10,
        position: 'relative'
      });

      scope.getValues = function () {
        return {
          'height': w.height(),
          'width': w.width(),
          'top': e.position().top,
          'left': e.position().left
        };
      };

      scope.$watch(scope.getValues, function (newValue) {
        // resize Grid to optimize height and position
        $(element)
          .width(newValue.width)
          .height(newValue.height)
          .css({
            'margin-left': -newValue.left,
            'margin-top': -newValue.top
          });
      }, true);

      w.bind('resize', function () {
        scope.$apply();
      });
    };
  });
