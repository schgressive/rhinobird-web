'use strict';

angular.module('rhinobird')
  .constant('settings', {
    apiHost: '/v1',
    channelCleanedRegex: /[^\d^\w]/g
  });

