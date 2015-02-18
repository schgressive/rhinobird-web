angular
  .module('rhinobird.directives')
  .directive('rbAvatar', rbAvatar);

  function rbAvatar() {

    var directive = {
      restrict: 'E',
      scope: {
        user: '='
      },
      replace: true,
      templateUrl: '/views/directives/avatar.html'
    };

    return directive;
  }

