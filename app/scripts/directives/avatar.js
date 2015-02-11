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
      templateUrl: '/views/templates/avatar.html'
    };

    return directive;
  }

