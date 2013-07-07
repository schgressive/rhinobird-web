'use strict';

angular.module('peepoltvApp')
  .controller('ChannelCtrl', function ($scope, channelService, $routeParams) {

    // Get the channel
    $scope.channel = channelService.resource.get({channelId: $routeParams.channelName});
  });
