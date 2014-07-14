'use strict';

angular.module('rhinobird.controllers')
  .controller('ProfileCtrl', function ($scope, User, session, $location, OpenAndWatch) {

    $scope.self = $scope;

    $scope.connectPopup = function(network) {
      OpenAndWatch.open("/registration/" + network + "?popup=true", "_blank", {}, function(win) {
        session.$fetch();
      });
    }

    // Expose the user in the scope
    $scope.user = session.user;

    // Expose the user streams
    var userTmp = User.$build({username: session.user.username});
    $scope.timeline = userTmp.timeline.$collection({ pending: true });
    $scope.timeline.getNextPage();

    // apply active class to tabs
    $scope.getClass = function(path) {
      if ($location.path().substr(0, path.length) === path) {
        return 'active';
      } else {
        return '';
      }
    };

    $scope.disconnect = function(network) {
      $scope.user[network + "_token"] = null;
      $scope.updateSettings();
    }

    $scope.updateSettings = function(){
      $scope.user.$save();
    };

  });
