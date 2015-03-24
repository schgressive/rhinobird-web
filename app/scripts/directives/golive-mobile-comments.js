'use strict';

angular.module('rhinobird.directives')
  .directive('goliveMobileComments', function ($window, $compile, User, CommentsService, AuthService) {

    function link (scope, element, attrs) {

      // VM
      scope.roomId = scope.stream.id;
      scope.user = AuthService.user;
      scope.app = scope.$parent.app;

      // Keep a track of fetched comments
      scope.comments = [];
      scope.currentCommentIndex = 0;

      // HTML Elements
      //
      var loadMoreLink      = element.find('.rb-load-more'),
          submitForm        = element.find('.golive-feed form'),
          textInput         = element.find('.golive-feed .comment-input'),
          commentsContainer = element.find('.feed-list');

      // Helpers
      //
      function prepareMessageForDisplay(message) {
        message.user = User.$buildRaw(message.user);
        return message;
      }

      function scrollToBottom() {
        commentsContainer.scrollTop(commentsContainer.prop("scrollHeight"));
      }

      // API Bindings
      //
      CommentsService.API.on('incomming-history', function (history) {
        for (var i=0; i<history.messages.length; i++) {
          scope.comments.push(prepareMessageForDisplay(history.messages[i]));
        }
        scope.$apply();
      }, this);

      CommentsService.API.on('end-of-history', function (history) {
        loadMoreLink.hide();
      }, this);

      CommentsService.API.on('incomming-message', function (message) {
        scope.comments.push(prepareMessageForDisplay(message));

        if (scope.user.username == message.user.username) {
          scope.currentCommentIndex = scope.comments.indexOf(message);
        } else {
          scope.currentCommentIndex++;
        }
        scope.$apply();
        scrollToBottom();
      }, this);

      // HTML Bindings
      //
      loadMoreLink.click(function () {
        CommentsService.API.fetchHistory(scope.roomId, {sorting: 'DESC'});
      });

      submitForm.submit(function () {
        if (textInput.val() != "") {
          CommentsService.API.sendMessage(scope.roomId, textInput.val());
          textInput.val('');
        }
        return false;
      });

      // Join and Fetch history
      //
      CommentsService.API.joinRoom(scope.roomId);
      CommentsService.API.fetchHistory(scope.roomId, {sorting: 'DESC'});
    }

    return {
      templateUrl: '/views/rb-comments/golive-mobile-comments.html',
      scope: {
        stream: '='
      },
      link: link
    };
  })

  .directive('goliveMobileComment', function () {
    return {
      templateUrl: '/views/rb-comments/golive-mobile-comment.html'
    }
  });

