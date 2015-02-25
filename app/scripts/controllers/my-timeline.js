'use strict';

angular.module('rhinobird.controllers')

  .controller('MyTimelineCtrl', function (User) {

    // Expose the scope as self
    var vm = this;
    vm.user = User.$new("current");

    // Get the timeline
    vm.user.timeline.$collection();
    vm.user.timeline.$refresh({page: 1});
    vm.user.timeline.getNextPage();

  });

