'use strict';

angular.module('peepoltv')
  .controller('ChannelCtrl', function ($scope, $stateParams, $timeout, $browser, AuthService, channel) {

		$scope.user = AuthService.user;

    /**
     * SCOPE
     */
    $scope.self = $scope; // Expose the scope as self

    // The channel
    $scope.channel = channel;

    $scope.$on('main-stream-changed', function(event, stream){

      // Set the current stream
      $scope.currentStream = stream;

    });

  });
