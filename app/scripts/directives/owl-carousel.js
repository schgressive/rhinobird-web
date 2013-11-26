'use strict';

angular.module('peepoltvApp')
  .directive('owlCarousel', function ($timeout) {
    return {
      template: '<div class="owl-carousel"><div class="item" ng-repeat="stream in items"><div ng-include="itemTemplate"></div></div></div>',
      replace: true,
      restrict: 'EA',
      scope: {
        items: '=',
        itemTemplate: '@'
      },
      link: function postLink(scope, element, attrs) {

        scope.$watchCollection('items', function(a, b){
          if (a && a.length == 0)
            return;
          /* video slider */
          console.log("will wait")
          $timeout(function(){

            $('.owl-carousel').owlCarousel({
              items: 6,
              itemsDesktop : [1199,4],
              itemsDesktopSmall : [980,4],
              itemsTablet: [768,3],
              itemsMobile : [479,3],
              pagination: false,
              navigation: true
            });
            $(".next").click(function(){
              owl.trigger('owl.next');
            })
            $(".prev").click(function(){
              owl.trigger('owl.prev');
            });
            console.log("ok")
          //debugger;

          },500);
       });
      }
    };
  });
