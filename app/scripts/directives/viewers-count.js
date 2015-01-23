'use strict';

angular.module('rhinobird.directives')
  .directive('viewers-count', function ($window, $compile) {

    function link (scope, element, attrs) {

      var streamId = null;
      if (scope.stream)
        stream = scope.stream.id
      else if (scope.vm)
        stream = scope.vm.stream.id

      // Create a new instance of Comments Client
      //
      var rbComments = new $window.RbComments.API({
        socketLib:        ioSafe,
        host:             '/comments_app_host',
        libPath:          '/comments_app_host/socket.io',
        auth_token:       scope.user.authenticationToken,
        roomId:           streamId,
      });
    }

    return {
      templateUrl: '/views/rb-comments.html',
      link: link
    };
  })

  .directive('comment', function () {
    return {
      templateUrl: '/views/rb-comment.html'
    }
  });
