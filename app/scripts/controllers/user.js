'use strict';

angular.module('rhinobird.controllers')
  .controller('UserCtrl', function ($state, user) {

    var vm = this;

    vm.user = user;
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

    function toggleFollow() {
      if (!user.followed) {
        user.followed = true;
        user.following.$create();
      } else {
        user.followed = false;
        user.$unfollow();
      }
    }

  });
