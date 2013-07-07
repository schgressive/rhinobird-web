'use strict';

angular.module('peepoltvApp')
  .controller('ChannelsCtrl', function ($scope, $routeParams) {

    // Set the current section
    $scope.section = $routeParams.section || 'local';
  });
