'use strict';

angular.module('peepoltvApp')
  .controller('SearchResultsCtrl', function ($scope, $location, AuthService, Stream) {

    $scope.searchTerm = $location.search().q;
    $scope.filter = $location.search().filter;

    // Get the streams based on geolocation
    $scope.streams = Stream.$search();

    $scope.filterBy = function(filter){
      $location.search('filter', filter);
    };

    $scope.user = AuthService.user;
  });
