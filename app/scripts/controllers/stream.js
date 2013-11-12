'use strict';

angular.module('peepoltvApp')
  .controller('StreamCtrl', function ($scope, streamService, $routeParams, authService) {

		$scope.user = authService.user;

    // Get the stream
    $scope.stream = streamService.resource.get({streamId: $routeParams.streamId});
  });
