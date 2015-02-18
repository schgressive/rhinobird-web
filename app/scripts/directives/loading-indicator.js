'use strict';

angular.module('rhinobird.directives')
  .directive('standardLoadingIndicator', function ($http, $rootScope, $timeout) {

    var elements = [],
        startedCount = 0;

    function startAnimation (event) {
      startedCount++;

      if (startedCount == 1) {
        for (var i in elements) {
          elements[i].addClass('animate');
        }
      }
    };

    function endAnimation () {
      startedCount--;

      if (startedCount <= 0) {
        for (var i in elements) {
          elements[i].removeClass('animate');
        }

        startedCount = 0;
      }
    };

    function link (scope, element, attrs) {
      elements.push(element);
    };

    $rootScope.$on('request-success',     function () { $timeout(startAnimation, 1); });
    $rootScope.$on('$stateChangeStart',   function () { $timeout(startAnimation, 1); });
    $rootScope.$on('viewContentLoading',  function () { $timeout(startAnimation, 1); });

    $rootScope.$on('response-success',    function () { $timeout(endAnimation, 1000); });
    $rootScope.$on('request-error',       function () { $timeout(endAnimation, 1000); });
    $rootScope.$on('response-error',      function () { $timeout(endAnimation, 1000); });
    $rootScope.$on('$stateChangeSuccess', function () { $timeout(endAnimation, 1000); });
    $rootScope.$on('$stateChangeError',   function () { $timeout(endAnimation, 1000); });
    $rootScope.$on('viewContentLoaded',   function () { $timeout(endAnimation, 1000); });

    return {
      link: link
    }
  });

