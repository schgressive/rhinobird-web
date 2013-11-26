'use strict';

angular.module('peepoltvApp')
  .controller('ChannelCtrl', function ($scope, $stateParams, $timeout, AuthService, channel) {

		$scope.user = AuthService.user;

    // Get the channel
    $scope.channel = channel;

    // The playing stream
    $scope.mainStream = $scope.channel.streams[0];

    $scope.changeMainStream = function(stream){
      $scope.mainStream = stream;
    }

  });
