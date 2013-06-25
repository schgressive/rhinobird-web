'use strict';

angular.module('peepoltvApp')
  .controller('ChannelsCtrl', ['$scope', 'streamService', '$routeParams', function ($scope, streamService, $routeParams) {

    // Get the streams based on geolocation
    streamService.resource.search({}, function(r){
        $scope.streams = _.map(r, function(s){
          s.properties['marker-size'] = 'medium';
          s.properties['marker-color'] = '#aa56ff';
          s.properties['marker-symbol'] = 'cinema';
          return s;
        });
    });

    $scope.section = $routeParams.section || "local";
}]);
