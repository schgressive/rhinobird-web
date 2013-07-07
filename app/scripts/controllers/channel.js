'use strict';

angular.module('peepoltvApp')
  .controller('ChannelCtrl', function ($scope, channelService, $routeParams) {

    // Get the channel
    $scope.channel = channelService.resource.get({channelId: $routeParams.channelName}, function(){
      // The playing stream
      $scope.mainStream = $scope.channel.streams[0];
    });

    $scope.changeMainStream = function(stream){
      $scope.mainStream = stream;
    }

  });
