'use strict';

/* global SparkMD5: false */

angular.module('rhinobird.filters')
  .filter('gravatar', function() {
    return function(input, size, defaultImage){
      if (input) {
        var emailHash = SparkMD5.hash(input.toLowerCase().trim());
        return 'http://www.gravatar.com/avatar/' + emailHash + '?s=' + size;
      } else {
        return defaultImage;
      }
    };
  });
