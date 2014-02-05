'use strict';

angular.module('peepoltv.controllers')
  .controller('SearchResultsCtrl', function ($scope, $location, AuthService, Stream, $state, User, Channel) {

    $scope.searchTerm = $location.search().q;
    $scope.filter = $location.search().filter;

    // Get the streams based on geolocation
    $scope.streams = Stream.$search($state.params);
    $scope.peepol = User.$search($state.params);
    $scope.channels = Channel.$search($state.params);

    $scope.filterBy = function(filter){
      $location.search('filter', filter);
    };

    $scope.user = AuthService.user;

    // apply active class to tabs
    $scope.getClass = function(path) {
		    if ($location.path().substr(0, path.length) == path) {
		      return "active"
		    } else {
		      return ""
		    }
		}

  });
