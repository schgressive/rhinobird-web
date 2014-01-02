'use strict';

angular.module('peepoltvApp')
  .controller('ProfileCtrl', function ($scope, AuthService) {

  	$scope.self = $scope;

  	// Expose the user in the scope
  	$scope.user = AuthService.user;

  });
