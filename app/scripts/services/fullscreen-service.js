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

    var eventName = "";
    if (screenfull && screenfull.raw && screenfull.raw.fullscreenchange) {
      eventName = screenfull.raw.fullscreenchange
    } else {
      eventName = "webkitfullscreenchange";
    }

    $document.on(eventName, function () {
      var enabled = API.isEnabled();
      $rootScope.isFullScreenEnabled = enabled;
      $rootScope.$emit('fullscreen-change', enabled);
      $rootScope.$digest();
    });

    return API;
});

