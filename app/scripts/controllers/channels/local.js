'use strict';

angular.module('peepoltvApp')
  .controller('ChannelsLocalCtrl', function ($scope, channelService) {

    // Get the streams based on geolocation
    $scope.channels = channelService.resource.search();
  });
