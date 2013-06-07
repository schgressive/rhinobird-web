'use strict';

angular.module('peepoltvApp')
  .controller('ChannelsCtrl', ['$scope', 'Streams', function ($scope, Streams) {
    
    // Get the streams based on geolocation
    Streams.search({}, function(r){
        $scope.streams = _.map(r, function(s){
          s.properties['marker-size'] = 'medium';
          s.properties['marker-color'] = '#aa56ff';
          s.properties['marker-symbol'] = 'cinema';
          return s;
    });
    
  }]);
