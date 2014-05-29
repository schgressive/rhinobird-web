'use strict';

angular.module('rhinobird.directives')
  .directive('videoCanvasProjector', function () {

    return {
      template: '<canvas width="{{width}}" height="{{height}}"></canvas>',
      replace: true,
      restrict: 'EA',
      scope:{
        width: '@',
        height: '@',
        video: '='
      },
      link: function postLink(scope, element) {
        // var previewStream, currentStream; // Streams
        var canvas, ctx; // Canvas and it's context
        var interval;

        // clear big stream
        var clearBigScreen = function(){
          // Stop the interval
          if(interval){
            clearInterval(interval);
          }

          // Clear the big screen
          drawScreen(null, true);
        };

        var projectVideo = function(video){
          if(!video){
            clearBigScreen();
            return;
          }

          // Clear the interval to start a new one
          if(interval){
            clearInterval(interval);
          }

          // Create a new interval to render the video
          if(video){
            interval = setInterval(function(){
              drawScreen(video);
            }, 33);
          }
        };

        // Redrew at framerate to the canvas
        var drawScreen = function(video, clear){
          // dont't clear
          clear = clear || false;

          var width = canvas.width();
          var height = canvas.height();

          // Destination size

          // Paint the frame
          if(clear || !video){
            // paint it black
            ctx.fillStyle = 'rgb(0,0,0)';
            ctx.fillRect (0, 0, width, height);
          }
          else {
            var dWidth = height*video.videoWidth/video.videoHeight;
            //var dHeight = height;
            var widthDiff = (width-dWidth)/2;

            //ctx.drawImage(video , widthDiff, 0, dWidth, dHeight);
            ctx.drawImage(video , 0, 0, 640, 360);

            // paint it black
            ctx.fillStyle = 'rgb(0,0,0)';
            ctx.fillRect (0, 0, widthDiff, height);

            // paint it black
            ctx.fillStyle = 'rgb(0,0,0)';
            ctx.fillRect (widthDiff + dWidth, 0, widthDiff, height);
          }
        };

        // Prepare the canvas
        canvas = element;
        ctx = canvas[0].getContext('2d');

        // Project the video on the canvas when the video element change
        scope.$watch('video', projectVideo);

      }
    };
  });
