'use strict';

angular.module('peepoltvApp')
  .controller('StreamCtrl', function ($scope, streamService, $routeParams, AuthService, $timeout) {

		$scope.user = AuthService.user;

    // Get the stream
    $scope.stream = streamService.resource.get({streamId: $routeParams.streamId});

		// Get the streams based on geolocation
    $scope.streams = streamService.resource.search({});

		$scope.$watchCollection('streams', function(a, b){
			if (a.length == 0)
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

});
