'use strict';

angular.module('peepoltvApp')

  .controller('MainCtrl', function ($scope, streamService, $location) {

    // Get the streams based on geolocation
    $scope.streams = streamService.resource.search({});

    // Search streams
    $scope.searchStreams = function(){
      $location.url("/search?q=" + $scope.searchString);
    };

  });
