'use strict';

angular.module('rhinobird')
  .constant('settings', {
    apiHost: 'http://api.beta.rhinobird.tv/v1',
    channelCleanedRegex: /[^\d^\w]/g
  });

