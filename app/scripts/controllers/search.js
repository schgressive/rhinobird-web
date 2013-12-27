'use strict';

angular.module('peepoltvApp')
  .controller('SearchCtrl', function ($scope, $state) {
    $scope.searchTerms = $state.params.q;
    $scope.search = function() {
      $state.go('search.streams', {q: $scope.searchTerms} );
    }
  });
