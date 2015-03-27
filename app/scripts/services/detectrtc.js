'use strict';

/* global google: false */

angular.module('rhinobird.services').
  service('DetectRTCService', function($window, DeviceDetector) {

    if (DeviceDetector.isBowser) {
      return {
        isWebRTCSupported: true
      }
    } else {
      return $window.DetectRTC;
    }

});

