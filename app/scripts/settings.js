'use strict';

angular.module('peepoltvApp')
  .constant('settings', {
    apiHost: '/api',
    channelCleanedRegex: /[^\d^\w]/g
  });

