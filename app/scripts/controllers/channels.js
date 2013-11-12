'use strict';

angular.module('peepoltvApp')
  .controller('ChannelsCtrl', function ($scope, $routeParams, authService) {

		$scope.user = authService.user;

    // Set the current section
    $scope.section = $routeParams.section || 'local';
  });
