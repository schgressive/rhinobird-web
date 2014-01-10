'use strict';

angular.module('peepoltv.controllers')
  .controller('ProfileCtrl', function ($scope, User, session) {

    $scope.self = $scope;

    // Expose the user in the scope
    $scope.user = session.user;

    // Expose the user streams
    var userTmp = User.$build(session.user.username);
    $scope.streams = userTmp.streams.getNextPage();

  });
