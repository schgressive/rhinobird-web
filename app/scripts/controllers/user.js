'use strict';

angular.module('rhinobird.controllers')
  .controller('UserCtrl', function ($state, user, AuthService) {

    var vm = this;

    vm.user = user;
    vm.currentUser = AuthService.user;
    vm.toggleFollow = toggleFollow;

    init()

    function init() {
      // Go to default tab
      $state.go('user.streams');
      // Get the user timeline
      vm.timeline = user.timeline.$collection();
      vm.timeline.getNextPage();

      user.followers.$fetch();
      user.following.$fetch();
    }

    function toggleFollow(_user) {
      if (!_user.followed) {
        _user.followed = true;
        _user.followers.$create();
      } else {
        _user.followed = false;
        _user.$unfollow().$then(function() {
          var current_user  = _.find(_user.followers, function(usr) { return usr.id == AuthService.user.id });
          _user.followers.$remove(current_user);
        });
      }
    }

  });
