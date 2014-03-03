'use strict';

angular.module('peepoltv.controllers')
  .controller('ProfileCtrl', function ($scope, User, session) {

    $scope.self = $scope;

    // Expose the user in the scope
    $scope.user = session.user;

    // Expose the user streams
    var userTmp = User.$build({id: session.user.username});
    $scope.streams = userTmp.streams.getNextPage();

    // apply active class to tabs
    $scope.getClass = function(path) {
		    if ($location.path().substr(0, path.length) == path) {
		      return "active"
		    } else {
		      return ""
		    }
		}

  });
