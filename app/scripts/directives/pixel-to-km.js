'use strict';

angular.module('rhinobird.directives')
  .directive('pixelToKm', function ($window) {
    // constant to calc pixels to metters
    var EcuatorSize = 40075016.68;

    var pixelsToMts = function(zoom, pixels) {
      var metters = EcuatorSize / (pixels * (Math.pow(2, zoom)) );
      metters =  metters * pixels;
      if (metters < 1000) {
        metters = 1000;
      }
      return metters;
    };

    return {
      restrict: 'A',
      scope: {
        currentKm: '=currentKm',
        zoom: '=zoom'
      },
      link: function(scope, element) {
        var w = angular.element($window);
        var e = angular.element(element);

        var metters = pixelsToMts(scope.zoom, e.height());
        scope.currentKm = Math.floor(metters / 1000);


        scope.$watch('zoom', function() {
          var metters = pixelsToMts(scope.zoom, e.height());
          scope.currentKm = Math.floor(metters / 1000);
        });

        w.bind('resize', function () {
          var metters = pixelsToMts(scope.zoom, e.height());
          scope.currentKm = Math.floor(metters / 1000);
          scope.$apply();
        });
      }
    };
  });

