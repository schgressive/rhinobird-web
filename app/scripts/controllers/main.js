'use strict';

angular.module('peepoltvApp')
  .controller('MainCtrl', ['$scope', function ($scope) {
    var map = new GMaps({
      el: '#map',
      lat: -12.043333,
      lng: -77.028333
    });

  }]);
