'use strict';

angular.module('peepoltvApp')
  .controller('ChannelsLocalCtrl', function ($scope, channelService) {

    // Get the streams based on geolocation
    $scope.channels = channelService.resource.search({}, function(){

      $scope.channel = $scope.channels[2];
      $scope.mainStream = $scope.channel.streams[0];

    });

    $scope.changeMainStream = function(stream){
      $scope.mainStream = stream;
    }
  });
