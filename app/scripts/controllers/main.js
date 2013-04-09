'use strict';

angular.module('peepoltvApp')
  .controller('MainCtrl', ['$scope', 'Streams', function ($scope, Streams) {
    var map = new GMaps({
      el: '#map',
      lat: -12.043333,
      lng: -77.028333
    });

    // Get the streams basen on geolocation
    Streams.search({}, function(r){
        $scope.streams = r;
    });
  }]);
