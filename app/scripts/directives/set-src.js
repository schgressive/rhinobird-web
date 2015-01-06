'use strict';

angular.module('rhinobird.directives')
.directive("setSrc", [function () {
    return {
        scope: {
            setSrc: "="
        },
        link: function (scope, element, attributes) {
          scope.$watch('setSrc', function(newVal) {
            element.attr('src', newVal);
          })
        }
    }
}]);
