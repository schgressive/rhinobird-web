angular
  .module('rhinobird.directives')
  .directive('rbVideoActions', rbVideoActions);

  function rbVideoActions() {

    var directive = {
      restrict: 'E',
      scope: {
        resource: '='
      },
      replace: true,
      controller: VideoActionsCtrl,
      controllerAs: 'vm',
      bindToController: true, // because the scope is isolated
      templateUrl: '/views/directives/video-actions.html'
    };

    return directive;
  }

VideoActionsCtrl.$inject = ['$location', '$window', 'CommentsService'];

function VideoActionsCtrl($location, $window, CommentsService) {
    var vm = this;

    // Expose methods
    vm.like = like;
    vm.repost = repost;
    vm.url = encodeURIComponent($location.absUrl());
    vm.shareTextEnconded = $window.escape('|WATCH THIS|');

    function repost() {
      vm.resource.repost();
    }

    function like() {
      CommentsService.API.addLike(vm.resource.id);
      vm.resource.toggleLike();
    }

}


