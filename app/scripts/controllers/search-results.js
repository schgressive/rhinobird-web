'use strict';

angular.module('rhinobird.controllers')
  .controller('SearchResultsCtrl', function ($scope, $location, AuthService, Stream, $state, User, Channel) {

    $scope.searchTerm = $location.search().q;
    $scope.filter = $location.search().filter;

    // Get the streams based on geolocation
    $scope.streams = Stream.$search($state.params);
    $scope.people = User.$search($state.params);
    $scope.channels = Channel.$search($state.params);

    $scope.filterBy = function(filter){
      $location.search('filter', filter);
    };

    $scope.user = AuthService.user;

  });
