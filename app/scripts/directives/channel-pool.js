'use strict';

angular.module('peepoltvApp')
  .directive('channelPool', function ($timeout) {
    return {
      templateUrl: '/views/templates/channel-pool.html',
      restrict: 'EA',
      scope: {
        channel: '=',
        vj: '@'
      },
      link: function postLink(scope, element, attrs) {

        // Set the self scope reference
        scope.self = scope;

        // Set default max streams quantity
        attrs.maxStreams = attrs.maxStreams || 4;

        // Get the live streams from this channel
        scope.liveStreams = scope.channel.streams.live().$then(function(){
          // Sets the first streams as playing if this is and outbound vj
          if(attrs.vjFlow === 'outbound'){
            _.each(scope.liveStreams, function(s, idx){
              s.isPlaying = (idx < attrs.maxStreams);
            });
          }
        });

        // Change the main stream
        scope.changeStream = function(stream){

          // Mute all the videos
          _.each(scope.liveStreams, function(_stream){
            if(_stream.isPlaying && _stream.licode){
              _stream.licode.player.video.muted = true;
            }
          });

          // Unmute the main stream
          stream.licode.player.video.muted = false;

          // Trigger an event saying that we should show a new stream
          scope.$emit('main-stream-changed', stream);
        };

        scope.$watchCollection('liveStreams', function(s){
          if(!s || s.length === 0) { return; }

          // Apply the owl slider
          // Note: timeout is used as a hack to be sure the the owl plugin is applied
          // after the dom elements are created by the ng-repeat
          $timeout(function(){

            // Initialize the carousel
            $('.owl-carousel', element).owlCarousel({
              items: 2,
              itemsDesktop : [1199,2],
              itemsDesktopSmall : [980,2],
              itemsTablet: [768,2],
              itemsMobile : [479,2],
              pagination: false,
              navigation: true
            });
          });

        });
      }
    };
  });
