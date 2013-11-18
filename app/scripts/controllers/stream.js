'use strict';

angular.module('peepoltvApp')
  .controller('StreamCtrl', function ($scope, streamService, $routeParams, AuthService) {

		$scope.user = AuthService.user;

    // Get the stream
    $scope.stream = streamService.resource.get({streamId: $routeParams.streamId});
  });
