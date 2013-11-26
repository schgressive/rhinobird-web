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

    /**
     * VARIABLES
     */
    var vm = {}; // Define viewmodel

    /**
     * SCOPE
     */
    $scope.vm = vm; // Expose the viewmodel in the scope
    $scope.ctrl = this; // Expose the controller

    // The channel
    vm.channel = channel;

    // The live streams
    vm.liveStreams = channel.streams.live();

  });
