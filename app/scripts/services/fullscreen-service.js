'use strict';

/* global google: false */

angular.module('rhinobird.services').
  service('FullscreenService', function($document, $rootScope) {

    var API = {
      isEnabled: function () {
        return (screenfull.enabled && screenfull.isFullscreen);
      },

      disableFullScreen: function () {
        if (this.isEnabled)
          screenfull.exit();
      },

      toggleFullscreen: function (element) {
        if (!screenfull.enabled)
          return;

        if (this.isEnabled()) {
          screenfull.exit();
        } else if (element) {
          screenfull.request(element);
        } else {
          screenfull.request();
        }
      }
    }

    $document.on(screenfull.raw.fullscreenchange, function () {
      var enabled = API.isEnabled();
      $rootScope.isFullScreenEnabled = enabled;
      $rootScope.$emit('fullscreen-change', enabled);
      $rootScope.$digest();
    });

    return API;
});

