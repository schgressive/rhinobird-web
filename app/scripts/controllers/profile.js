'use strict';

angular.module('rhinobird.controllers')
  .controller('ProfileCtrl', function (User, session, $location, OpenAndWatch) {

    var vm = this;

    // Expose the user in the scope
    vm.user = session.user;
    // Expose the user streams
    var userTmp = User.$build({username: session.user.username});
    vm.timeline = userTmp.timeline.$collection({ pending: true });
    vm.timeline.getNextPage();

    // Expose methods to the VM
    vm.getClass = getClass;
    vm.connectPopup = connectPopup;
    vm.disconnect = disconnect;
    vm.updateSettings = updateSettings;


    // PRIVATE METHODS
    //
    // apply active class to tabs
    function getClass(path) {
      if ($location.path().substr(0, path.length) === path) {
        return 'active';
      } else {
        return '';
      }
    };

    function connectPopup(network) {
      OpenAndWatch.open("/registration/" + network + "?popup=true", "_blank", {}, function(win) {
        session.$fetch();
      });
    }

    function disconnect(network) {
      vm.user[network + "_token"] = null;
      vm.updateSettings();
    }

    function updateSettings(){
      vm.user.$save();
    };

  });
