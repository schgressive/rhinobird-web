'use strict';

/* global google: false */

angular.module('rhinobird.services').
  service('DeviceDetector', function($window) {

    return {
      chromeNeedsUpdate: function () {
        var needUpdate = false;

        var chromeString = $window.navigator.userAgent.match(/Chrome\/([0-9]+)\./);

        if (chromeString && chromeString[1]) {
          if (parseInt(chromeString[1]) < 41) {
            needUpdate = true
          }
        }

        return needUpdate;
      }
    };
});
