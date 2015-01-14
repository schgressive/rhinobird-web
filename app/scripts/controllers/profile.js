'use strict';

angular.module('rhinobird.controllers')
  .controller('ProfileCtrl', function (User, session, $location, AuthService,
                                       OpenAndWatch, ValidateUserResponse, $timeout, ImageCrop, $state) {

    var vm = this;

    // Expose the user in the scope
    vm.user = session.user;
    // Expose the user streams
    var userTmp = User.$build({username: session.user.username});
    vm.timeline = userTmp.timeline.$collection({ pending: true });
    vm.timeline.getNextPage();
    vm.avatar = "/images/profile-default.svg";

    // Expose methods to the VM
    vm.getClass = getClass;
    vm.connectPopup = connectPopup;
    vm.disconnect = disconnect;
    vm.updateSettings = updateSettings;
    vm.editImage = editImage;
    vm.deleteAccount = deleteAccount;


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

    function deleteAccount() {
      vm.deleting = true;
      vm.user.$destroy().$then(function() {
        AuthService.logout();
        $state.go('goodbye');
      }, function(error) {
        console.log('Error deleting account', error);
        vm.deleting = false;
      })

    }

    function connectPopup(network) {
      OpenAndWatch.open("/registration/" + network + "?popup=true", "_blank", {}, function(win) {
        session.$fetch();
      });
    }

    function disconnect(network) {
      vm.user[network + "_token"] = null;
      vm.updateSettings();
    }

    // Open the crop modal and returns the image
    function editImage(type) {
      var crop = (type == 'backdrop') ? false : true;
      ImageCrop.open(type,crop).then(function(image) {
        vm.user[type] = image;
      });
    }

    function updateSettings(form){
      vm.user.$save().$then(function() {
        vm.success = true;
        $timeout(function() {
          vm.success = false;
        }, 2500);
      }, function(error) {
        ValidateUserResponse.validate(form, error);
      });
    };

  });
