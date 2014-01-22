'use strict';

angular.module('peepoltv.directives')
  .directive('streamPool', function ($timeout) {
    return {
      templateUrl: '/views/templates/stream-pool.html',
      restrict: 'EA',
      scope: {
        streams: '=',
        currentStream: '=',
        vj: '@'
      },
      link: function postLink(scope, element, attrs) {

        // Set the self scope reference
        scope.self = scope;

        // Change the main stream
        scope.changeStream = function(stream){

          // Prepare all the videos
          _.each(scope.streams, function(_stream){
            if(_stream.isPlaying && _stream.licode){

              // Mute them
              _stream.licode.player.video.muted = true;

              // Reset projected
              _stream.isProjected = _stream.id === stream.id;
            }
          });

          // Unmute the main stream
          stream.licode.player.video.muted = false;

          // Trigger an event saying that we should show a new stream
          scope.$emit('main-stream-changed', stream);
        };

        // Watch for the currentStreams change
        scope.$watch('currentStream', function(value){
          if(value){
            scope.changeStream(value);
          }
        });

        // Watch if the streams collection change
        scope.$watchCollection('streams', function(s){
          if(!s || s.length === 0) { return; }

          // Apply the owl slider
          // Note: timeout is used as a hack to be sure the the owl plugin is applied
          // after the dom elements are created by the ng-repeat
          $timeout(function(){

            // Initialize the carousel
            $('.owl-carousel', element).owlCarousel({
              items: 4,
              itemsDesktop : false,
              itemsDesktopSmall : false,
              itemsTablet: false,
              itemsMobile : [767,3],
              pagination: false,
              navigation: true,
              scrollPerPage: true,
              afterAction : afterAction
            });
          });

        });

        // Update owl carrowsel status
        var afterAction = function(){
          var owlScope = this;

          scope.$apply(function(){
            // Disconnect the connected streams that are not visible
            _.each(scope.streams, function(stream){
              if(stream.isPlaying && !stream.isProjected){
                stream.isPlaying = false;
              }
            });

            // Connect the streams that become visible
            _.each(owlScope.visibleItems, function(i){
              var stream = scope.streams[i];

              // Update the token if it is null
              if(stream.token === null){
                stream.$fetch().$then(function(){
                  stream.isPlaying = true;
                });
              }
              else{
                stream.isPlaying = true;
              }
            });
          });
        };
      }
    };
  });
