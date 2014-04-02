'use strict';

angular.module('rhinobird')
  .constant('settings', {
    apiHost: '/api',
    channelCleanedRegex: /[^\d^\w]/g
  });

