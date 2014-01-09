'use strict';

angular.module('peepoltv.directives')
  .provider('streamViewerConfig', function(){
    var config = {
      presets: {},
      defaultPreset: undefined
    };

    return {
      $get: function(){
        return config;
      },
      /**
       * Adds a preset for the stream viewer size
       * @param {string} name
       * @param {int} width
       * @param {int} height
       */
      addPreset: function(name, width, height){
        // Adds a new preset
        config.presets[name] = [width, height];

        // Set the default preset
        config.defaultPreset = config.defaultPreset || name;
      },
      /**
       * Set the default stream viewer preset
       * @param {string} name
       */
      setDefaultPreset: function(name){
        config.defaultPreset = config.presets[name];
      }
    };
  })
  .directive('streamViewer', function (streamViewerConfig) {
    return {
      templateUrl: '/views/templates/stream-viewer.html',
      scope: {
        stream: '=',
        mute: '@',
        on: '@'
      },
      restrict: 'EA',
      link: function postLink(scope, element, attrs) {
        // Get the preset
        var preset = streamViewerConfig.presets[attrs.size] || streamViewerConfig.defaultPreset;

        // Set the sizes in the scope
        scope.width = preset[0];
        scope.height = preset[1];

        scope.$on('licode-video-created', function(event, licodeStream){
          // Set the licode stream object in the licode property of the stream
          scope.stream.licode = licodeStream;
        });
      }
    };
  });
