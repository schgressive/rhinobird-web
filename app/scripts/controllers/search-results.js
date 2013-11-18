'use strict';

angular.module('peepoltvApp')
  .controller('SearchResultsCtrl', function ($scope, streamService, $location, AuthService) {

    $scope.searchTerm = $location.search().q;
    $scope.filter = $location.search().filter;

    // Get the streams based on geolocation
    $scope.streams = streamService.resource.search({});

    $scope.filterBy = function(filter){
      $location.search('filter', filter);
    };

    $scope.user = AuthService.user;
  });
