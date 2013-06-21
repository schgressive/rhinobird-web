'use strict';

angular.module('peepoltvApp')
  .controller('SearchResultsCtrl', ['$scope', 'streamService', function ($scope, streamService) {

    // Get the streams based on geolocation
    streamService.resource.search({}, function(r){
        $scope.streams = _.map(r, function(s){
          s.properties['marker-size'] = 'medium';
          s.properties['marker-color'] = '#aa56ff';
          s.properties['marker-symbol'] = 'cinema';
          return s;
        });
    });
  }]);
