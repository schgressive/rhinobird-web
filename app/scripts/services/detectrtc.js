'use strict';

/* global google: false */

angular.module('rhinobird.services').
  service('DetectRTCService', function($window) {

    return $window.DetectRTC;

});

