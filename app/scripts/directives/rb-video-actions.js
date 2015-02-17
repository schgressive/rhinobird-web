angular
  .module('rhinobird.directives')
  .directive('rbVideoActions', rbVideoActions);

  function rbVideoActions() {

    var directive = {
      restrict: 'E',
      scope: {
        resource: '=',
        user: '='
      },
      replace: true,
      controller: VideoActionsCtrl,
      controllerAs: 'vm',
      bindToController: true, // because the scope is isolated
      templateUrl: '/views/directives/video-actions.html'
    };

    return directive;
  }

VideoActionsCtrl.$inject = [];

function VideoActionsCtrl() {
    var vm = this;

    // Expose methods
    vm.like = like;
    vm.repost = repost;

    function repost() {
      vm.resource.repost();
    }

    function like() {
      vm.resource.toggleLike();
    }

}


