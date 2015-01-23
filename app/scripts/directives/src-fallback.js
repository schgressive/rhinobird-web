angular.module('rhinobird.directives')
  .directive('srcFallback', function () {
    return {
      link: function postLink(scope, iElement, iAttrs) {
        iElement.bind('error', function() {
          angular.element(this).attr("src", iAttrs.srcFallback);
        });
      }
    };
  });
