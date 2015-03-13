'use strict';

angular.module('rhinobird.controllers')

  .controller('WorldCtrl', function (Timeline, Channel, User, GeolocationService) {
    var vm = this;

    vm.toggleFollow = toggleFollow;

    vm.exciting = [];
    vm.nearStreams = [];
    vm.channels = [];
    vm.users = [];

    init();

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

    function init() {
      GeolocationService.getCurrent().then(filterNear);
      vm.exciting = Timeline.$search({per_page: 8, order: 'popular'});
      vm.channels = Channel.$search({per_page: 12, order: 'latest'});
      vm.users = User.$search({per_page: 8, order: 'popular'});
    }

    function filterNear(data) {
      var query = {
        per_page: 8,
        lat: data.lat,
        lng: data.lng,
        live: true,
        archived: true
      };
      vm.nearStreams = Timeline.$search(query);
    }

  });
