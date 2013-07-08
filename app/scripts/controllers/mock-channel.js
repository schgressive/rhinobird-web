'use strict';

angular.module('peepoltvApp')
  .controller('MockChannelCtrl', function ($scope) {

    $scope.streams = [
      {
        title: 'Protests turn violent in Oxford Street, London',
        geo: 'London, England',
        tags: ['violence', 'protest'],
        comments: 43,
        rebrodcasts: 32,
        likes: 190
      },
      {
        title: 'Three Mursi supporters reportedly shot dead at Cairo barracks protest',
        geo: 'Cairo',
        tags: ['Mursi', 'protest', 'barracks'],
        comments: 3,
        rebrodcasts: 87,
        likes: 190
      },
      {
        title: 'Seattle May Day Protest 2013',
        geo: 'Seattle, US',
        tags: ['protest', 'May day'],
        comments: 43,
        rebrodcasts: 32,
        likes: 234
      },
      {
        title: ' Turkish police brutally disperse Istanbul park demolition ',
        geo: 'Istanbul, Turkey',
        tags: ['police'],
        comments: 23,
        rebrodcasts: 12,
        likes: 654
      },
      {
        title: 'Police presence at July 11 casseroles protest',
        geo: '',
        tags: ['police', 'casseroles', 'protest'],
        comments: 32,
        rebrodcasts: 65,
        likes: 76
      },
      {
        title: 'Verizon at iPhone 4s launch protest',
        geo: 'San Francisco, US',
        tags: ['iPhone', 'protest'],
        comments: 22,
        rebrodcasts: 34,
        likes: 270
      }
    ];

    $scope.stream = $scope.streams[0];

    var canvas = angular.element('#canvas');
    var ctx = canvas[0].getContext('2d');
    var interval, video;

    var drawScreen = function(){
      var width = canvas.width();
      var height = canvas.height();

      // Destination size
      var dWidth = height*video.videoWidth/video.videoHeight;
      var dHeight = height;
      var widthDiff = (width-dWidth)/2;

      // Paint the frame
      ctx.drawImage(video , widthDiff, 0, dWidth, dHeight);

      // paint it black
      ctx.fillStyle = "rgb(0,0,0)";
      ctx.fillRect (0, 0, widthDiff, height);

      // paint it black
      ctx.fillStyle = "rgb(0,0,0)";
      ctx.fillRect (widthDiff + dWidth, 0, widthDiff, height);
    };

    $scope.changeStream = function(streamId){
      // shut off the video
      if(video){
        video.muted = true;
      }

      video = angular.element('#stream' + streamId)[0];
      // Set video volume
      video.muted = false;

      if(interval){
        clearInterval(interval);
      }

      interval = setInterval(drawScreen, 33);

      $scope.stream = $scope.streams[streamId];
    };

    setTimeout(function(){
      $scope.changeStream(0);
    }, 1000);

  });
