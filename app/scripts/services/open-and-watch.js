'use strict';

/* global google: false */

angular.module('rhinobird.services').
  service('OpenAndWatch', function() {

  // Opens and watches for window close
  this.open = function(uri, name, options, closeCallback) {
    var win = window.open(uri, name, options);
    var interval = window.setInterval(function() {
      try {
        if (win == null || win.closed) {
          window.clearInterval(interval);
          closeCallback(win);
        }
      }
      catch (e) {
      }
    }, 1000);
    return win;
  };
});

