'use strict';

angular.module('rhinobird.controllers')
  .controller('AllChannelsCtrl', function (Channel, GeolocationService) {
    var vm = this;

    vm.by = 'latest';
    vm.filter = filter;
    vm.channels = [];

    init();


    function init() {
      GeolocationService.getCurrent().then(saveCoords);
      filter('latest');
    }

    function saveCoords(data) {
      vm.coords = {
        lat: data.lat,
        lng: data.lng,
      };
    };


    function filter(_by) {
      vm.by = _by;
      var query = {order: _by};
      if (_by == 'nearby') {
        angular.extend(query, vm.coords);
      }
      vm.channels = Channel.$search(query);
    }

  });
