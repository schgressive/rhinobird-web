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
      var loadMoreLink = element.find('.rb-load-more'),
          submitForm   = element.find('.cBox-bottom form'),
          textInput    = element.find('.cBox-bottom textarea'),
          moveNext     = element.find('.cBox-top .next'),
          movePrev     = element.find('.cBox-top .prev');

      // Helpers
      //
      function prepareMessageForDisplay(message) {
        message.user = User.$buildRaw(message.user);
        return message;
      }

      function disableButtons() {
        if (scope.currentCommentIndex == 0) {
          moveNext.attr('disabled', 'disabled');
        } else {
          moveNext.removeAttr('disabled');
        }

        if (scope.currentCommentIndex < scope.comments.length-1) {
          movePrev.removeAttr('disabled');
        } else {
          movePrev.attr('disabled', 'disabled');
        }
      }

      // API Bindings
      //
      CommentsService.API.on('incomming-history', function (history) {
        for (var i=0; i<history.messages.length; i++) {
          scope.comments.push(prepareMessageForDisplay(history.messages[i]));
        }
        disableButtons();
        scope.$apply();
      }, this);

      CommentsService.API.on('end-of-history', function (history) {
        loadMoreLink.hide();
      }, this);

      CommentsService.API.on('incomming-message', function (message) {
        textInput.val('');

        scope.comments.unshift(prepareMessageForDisplay(message));

        if (scope.user.username == message.user.username) {
          scope.currentCommentIndex = scope.comments.indexOf(message);
        } else {
          scope.currentCommentIndex++;
        }

        disableButtons();

        scope.$apply();
      }, this);

      // HTML Bindings
      //
      loadMoreLink.click(function () {
        CommentsService.API.fetchHistory(scope.roomId, {sorting: 'DESC'});
      });

      movePrev.click(function () {
        if (scope.comments.length > scope.currentCommentIndex + 1) {
          scope.currentCommentIndex++;
          scope.$apply();
        }
        disableButtons();
      });

      moveNext.click(function () {
        if (scope.currentCommentIndex >= 1) {
          scope.currentCommentIndex--;
          scope.$apply();
        }
        disableButtons();
      });

      submitForm.submit(function () {
        CommentsService.API.sendMessage(scope.roomId, textInput.val());
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

