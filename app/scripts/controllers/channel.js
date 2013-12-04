'use strict';

angular.module('peepoltvApp')
  .controller('ChannelCtrl', function ($scope, $stateParams, $timeout, $browser, AuthService, channel) {

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
