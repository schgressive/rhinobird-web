'use strict';

angular.module('rhinobird.directives')
  .directive('simpleCarousel', function ($timeout) {
    return {
      restrict: 'A',
      scope: {
        simpleCarouselWatch: '=',
        simpleCarouselOptions: '='
      },
      link: function postLink(scope, element) {
        var owl = $(element);
        var opts = {
          mobile: 1,
          tablet: 2,
          desktop: 4
        };
        angular.extend(opts, scope.simpleCarouselOptions || {});
        //
        // Watch if the streams collection change
        scope.$watchCollection('simpleCarouselWatch', function(s){
          if(!s || s.length === 0) { return; }

          // Apply the owl slider
          // Note: timeout is used as a hack to be sure the the owl plugin is applied
          // after the dom elements are created by the ng-repeat
          $timeout(function(){

            // Initialize the carousel
            owl.owlCarousel({
              items: opts.desktop,
              itemsDesktop : [1199, opts.desktop],
              itemsTablet: [768, opts.tablet],
              itemsMobile: [479, opts.mobile],
              pagination: false,
              navigation: true,
              scrollPerPage: true,
            });
          });

        });


      }
    };
  });

