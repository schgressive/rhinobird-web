'use strict';

/* global google: false */

angular.module('rhinobird.services').
  service('DeviceDetector', function($window, mobileDetect) {

    /* Detect if it is Bowser */
    var isBowser = $window.navigator.userAgent.match(/Bowser/);

    /* Override Bowser log useful for development */
    function overrideConsoleForBowser() {
      console = new Object();
      console.log = function(log) {
        var iframe = document.createElement("IFRAME");
        iframe.setAttribute("src", "ios-log:#iOS#" + log);
        document.documentElement.appendChild(iframe);
        iframe.parentNode.removeChild(iframe);
        iframe = null;
      };
      console.debug = console.log;
      console.info  = console.log;
      console.warn  = console.log;
      console.error = console.log;
    }

    /* Identify if Chrome needs update */
    function chromeNeedsUpdate() {
      var needUpdate = false;

      var chromeString = $window.navigator.userAgent.match(/Chrome\/([0-9]+)\./);

      if (chromeString && chromeString[1]) {
        if (parseInt(chromeString[1]) < 41) {
          needUpdate = true
        }
      }

      return isBowser ? false : needUpdate;
    }

    /* Init */
    if (isBowser)
      overrideConsoleForBowser();

    return {
      isBowser: isBowser,
      chromeNeedsUpdate: chromeNeedsUpdate
    };
});
