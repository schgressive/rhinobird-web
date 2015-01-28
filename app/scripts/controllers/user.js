'use strict';

angular.module('rhinobird.controllers')
  .controller('UserCtrl', function ($state, user, AuthService) {

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
        user.followers.$create();
      } else {
        user.followed = false;
        user.$unfollow().$then(function() {
          var current_user  = _.find(user.followers, function(usr) { return usr.id == AuthService.user.id });
          user.followers.$remove(current_user);
        });
      }
    }

  });
