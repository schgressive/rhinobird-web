'use strict';

angular.module('rhinobird.directives')
  .directive('simpleCarousel', function ($timeout) {
    return {
      restrict: 'A',
      scope: {
        simpleCarouselWatch: '=',
        simpleCarouselMobileItems: '@'
      },
      link: function postLink(scope, element) {
        var owl = $(element);
        var itemsMobile = scope.simpleCarouselMobileItems || 1;
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
              items: 4,
              itemsDesktop : false,
              itemsMobile: [479, itemsMobile],
              pagination: false,
              navigation: true,
              scrollPerPage: true,
            });
          });

        });


      }
    };
  });

