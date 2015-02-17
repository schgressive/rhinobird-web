angular
  .module('rhinobird.directives')
  .directive('rbTopBar', rbTopBar);

  function rbTopBar() {

    var directive = {
      restrict: 'E',
      scope: {
        user: '=',
        resource: '=',
        vjService: '=',
        app: '='
      },
      replace: true,
      transclude: true,
      controller: TopBarCtrl,
      controllerAs: 'vm',
      bindToController: true, // because the scope is isolated
      templateUrl: '/views/directives/top-bar.html'
    };

    return directive;
  }

TopBarCtrl.$inject = [];

function TopBarCtrl() {
    var vm = this;
}


