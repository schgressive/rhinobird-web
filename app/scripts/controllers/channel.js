'use strict';

angular.module('peepoltvApp')
  .controller('ChannelCtrl', function ($scope, $stateParams, $timeout, AuthService, Channel) {

		$scope.user = AuthService.user;

    // Get the channel
    $scope.channel = Channel.$find($stateParams.channelName).$then(function(){
      // The playing stream
      $scope.mainStream = $scope.channel.streams[0];
    });

    $scope.changeMainStream = function(stream){
      $scope.mainStream = stream;
    }

		$scope.$watchCollection('channel.streams', function(a, b){
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

  });
