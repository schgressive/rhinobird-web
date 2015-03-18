'use strict';

angular.module('rhinobird.controllers')

  .controller('PopularAnimalsCtrl', function (User) {
    var vm = this;


    init();

    function init() {
      vm.users = User.$search({per_page: 24, order: 'popular'});
    }

  });
