'use strict';

angular.module('rhinobird.directives')
  .directive('goliveMobileComments', function ($window, $compile, User) {

    function link (scope, element, attrs) {

      // Comments API hook and Room identifier
      var CommentsAPI = scope.CommentsService.API,
          roomId = scope.stream.id;

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
      CommentsAPI.on('incomming-history', function (history) {
        for (var i=0; i<history.messages.length; i++) {
          scope.comments.push(prepareMessageForDisplay(history.messages[i]));
        }
        disableButtons();
        scope.$apply();
      }, this);

      CommentsAPI.on('end-of-history', function (history) {
        loadMoreLink.hide();
      }, this);

      CommentsAPI.on('incomming-message', function (message) {
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
        CommentsAPI.fetchHistory(roomId, {sorting: 'DESC'});
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
        CommentsAPI.sendMessage(roomId, textInput.val());
        return false;
      });

      // Join and Fetch history
      //
      CommentsAPI.joinRoom(roomId);
      CommentsAPI.fetchHistory(roomId, {sorting: 'DESC'});
    }

    return {
      templateUrl: '/views/rb-comments/golive-mobile-comments.html',
      link: link
    };
  })

  .directive('goliveMobileComment', function () {
    return {
      templateUrl: '/views/rb-comments/golive-mobile-comment.html'
    }
  });

