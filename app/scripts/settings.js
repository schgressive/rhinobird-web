'use strict';

angular.module('rhinobird')
  .constant('settings', {
    apiHost: 'http://api.rhinobird.tv/beta',
    channelCleanedRegex: /[^\d^\w]/g
  });

