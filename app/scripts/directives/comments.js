'use strict';

angular.module('rhinobird.directives')
  .directive('comments', function ($window, $compile) {

    function link (scope, element, attrs) {

      // Override how the DOM Client for Comments will render a comment
      //
      RbComments.ClientDOM.prototype.onIncommingMessage = function (message, method) {
        var newScope = scope.$new(true);

        newScope.comment = message;

        // FIXME: HACK! booleans and nulls came as String from Redis.
        if (newScope.comment.user.photo == "null")
          newScope.comment.user.photo = null;

        var element = $compile($("<li comment class='comment'>"))(newScope);
        this.$listElement[method || 'prepend'](element);
      }

      // Create a new instance of Comments Client
      //
      var rbComments = new $window.RbComments.ClientDOM({
        socketLib:        ioSafe,
        host:             '/comments',
        libPath:          '/comments/socket.io',
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
  })

  .directive('comment', function () {
    return {
      templateUrl: '/views/rb-comment.html'
    }
  });
