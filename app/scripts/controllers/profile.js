'use strict';

angular.module('rhinobird.controllers')
  .controller('ProfileCtrl', function ($scope, User, session, $location) {

    $scope.self = $scope;

    var openDialog = function(uri, name, options, closeCallback) {
      var win = window.open(uri, name, options);
      var interval = window.setInterval(function() {
        try {
          if (win == null || win.closed) {
            window.clearInterval(interval);
            closeCallback(win);
          }
        }
        catch (e) {
        }
      }, 1000);
      return win;
    };

    $scope.connectPopup = function(network) {
      openDialog("/registration/" + network + "?popup=true", "_blank", {}, function(win) {
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
