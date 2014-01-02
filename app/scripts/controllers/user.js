'use strict';

angular.module('peepoltvApp')
  .controller('UserCtrl', function ($scope, $stateParams, User) {

    $scope.self = $scope;

    // Expose the user in the scope
    $scope.user = User.$find($stateParams.userName);
  });
