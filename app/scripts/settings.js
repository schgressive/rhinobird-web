'use strict';

angular.module('peepoltv')
  .constant('settings', {
    apiHost: '/api',
    channelCleanedRegex: /[^\d^\w]/g
  });

