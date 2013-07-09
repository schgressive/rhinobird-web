'use strict';

angular.module('peepoltvApp')
  .filter('skip', function () {
    return function (input, count) {
      if(angular.isArray(input)){
        return _.rest(input, count);
      }
      else{
        return input;
      }
    };
  });
