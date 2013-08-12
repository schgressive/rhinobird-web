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

    channelService.resource.search({}, function(data) {
      var groups = _.groupBy(data, function(channel) {
        return channel.name.charAt(0);
      })
      $scope.letters = groups;

    });
  });
