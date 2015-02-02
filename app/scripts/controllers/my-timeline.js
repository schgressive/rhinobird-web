'use strict';

angular.module('rhinobird.controllers')

  .controller('MyTimelineCtrl', function (AuthService) {

    // Expose the scope as self
    var vm = this;
    vm.user = AuthService.user;

    // Get the timeline
    vm.user.timeline.$collection();
    vm.user.timeline.getNextPage();

  });

