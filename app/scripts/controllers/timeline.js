'use strict';

angular.module('rhinobird.controllers')

  .controller('TimelineCtrl', function(User, $state, Timeline, GeolocationService) {

    // Expose the scope as self
    var vm = this;
    vm.user = User.$new("current");

    init();


    function setupTimeline() {
      if ($state.includes('main.timeline')) {
        vm.page = 'myrb';
        vm.timeline = vm.user.timeline;
        vm.timeline.$collection();
        vm.timeline.$refresh({page: 1});
        vm.timeline.getNextPage();
      }

      if ($state.includes('main.exciting')) {
        vm.page = 'exciting';
        vm.timeline = Timeline.$search({order: 'popular'});
      }

      if ($state.includes('main.near')) {
        vm.page = 'near';
        GeolocationService.getCurrent().then(function(data) {
          var query = {
            lat: data.lat,
            lng: data.lng,
            live: true,
            archived: true
          };
          vm.timeline = Timeline.$search(query);
        });
      }
    }
    function init() {
      setupTimeline();
    }

  });

