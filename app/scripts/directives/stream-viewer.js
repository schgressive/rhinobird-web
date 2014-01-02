'use strict';

angular.module('peepoltvApp')
  .directive('streamViewer', function () {
    var DEFAULT_SIZE = 'large';

    var TEMPLATE_PATH = '/views/templates/stream-viewer/';

    var URL = {
      mini: 'stream-viewer-mini.html',
      large: 'stream-viewer-large.html'
    };

    return {
      templateUrl: function(e){
        return TEMPLATE_PATH + (URL[e.attr('size')] || URL[DEFAULT_SIZE]);
      },
      scope: {
        stream: '=',
        mute: '@',
        on: '@'
      },
      restrict: 'EA',
      link: function postLink(scope) {
        scope.$on('stream-video-created', function(event, licodeStream){
          // Set the licode stream object in the licode property of the stream
          scope.stream.licode = licodeStream;
        });
      }
    };
  });
