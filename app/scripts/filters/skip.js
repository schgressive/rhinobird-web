'use strict';

angular.module('peepoltvApp')
  .filter('skip', function () {
    return function (input, count) {
      return _.rest(input, count);
    };
  });
