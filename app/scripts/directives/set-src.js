'use strict';

angular.module('rhinobird.directives')
.directive("setSrc", [function () {
    return {
        scope: {
            setSrc: "="
        },
        link: function (scope, element, attributes) {
          scope.$watch('setSrc', function(newVal) {
            if (newVal != null) {
              element.attr('src', newVal);
            }
          })
        }
    }
}]);
