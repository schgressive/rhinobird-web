'use strict';

angular.module('rhinobird.directives')
  .directive('comments', function ($window, $compile) {

    function link (scope, element, attrs) {

      // Override how the DOM Client for Comments will render a comment
      //
      RbComments.ClientDOM.prototype.onIncommingMessage = function (message, history) {
        var newScope = scope.$new(true);

        newScope.comment = message;

        // FIXME: HACK! booleans and nulls came as String from Redis.
        if (newScope.comment.user.photo == "null")
          newScope.comment.user.photo = null;

        var element = $compile($("<li comment class='comment'>"))(newScope);
        if (history) {
          this.$listElement.append(element);
        } else {
          this.$listElement.prepend(element);
          scope.vm.commentsCount += 1;
        }
      };

      var stream = null;
      if (scope.stream)
        stream = scope.stream.id
      else if (scope.vm)
        stream = scope.vm.stream.id

      // Create a new instance of Comments Client
      //
      var rbComments = new $window.RbComments.ClientDOM({
        socketLib:        ioSafe,
        host:             '/comments_app_host',
        libPath:          '/comments_app_host/socket.io',
        auth_token:       scope.user.authenticationToken,
        roomId:           stream,
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
