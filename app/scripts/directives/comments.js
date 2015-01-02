'use strict';

angular.module('rhinobird.directives')
  .directive('comments', function ($window) {

    function link (scope, element, attrs) {

      debugger
      var rbComments = new $window.RbComments.ClientDOM({
        host:             'http://localhost:8000',
        auth_token:       scope.user.authenticationToken,
        roomId:           scope.stream.id,
        formSelector:     '.rb-comments-form',
        inputSelector:    '.rb-comments-input',
        listSelector:     '.rb-comments-list',
        loadMoreSelector: '.rb-load-more'
      });
    }

    return {
      templateUrl: '/views/rb-comments.html',
      link: link
    };
  });
