'use strict';

angular.module('rhinobird.directives')
  .directive('standardLoadingIndicator', function ($http) {

    var $element = null;

    function startAnimation () {
      $element.addClass('animate');
    }

    function endAnimation () {
    }

    function link (scope, element, attrs) {
      $element = element;

      scope.$on('request-success',  startAnimation);
      scope.$on('response-success', endAnimation);
      scope.$on('request-error',    endAnimation);
      scope.$on('response-error',   endAnimation);
    };

    return {
      link: link
    }
  });

