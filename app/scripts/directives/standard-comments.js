'use strict';

angular.module('rhinobird.directives')
  .directive('standardComments', function ($window, $compile, User, CommentsService, AuthService) {

    function link (scope, element, attrs) {

      // VM
      scope.roomId = scope.room ? scope.room : scope.stream.id;
      scope.user = AuthService.user;
      scope.app = scope.$parent.app;

      // Keep a track of fetched comments
      scope.comments = [];

      // HTML Elements
      //
      var loadMoreLink = element.find('.rb-load-more'),
          submitForm   = element.find('.rb-comments-form'),
          textInput    = element.find('.rb-comments-input');

      // Helpers
      //
      function prepareMessageForDisplay(message) {
        message.user = User.$buildRaw(message.user);
        return message;
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
        textInput.val('');
        scope.comments.unshift(prepareMessageForDisplay(message));
        scope.$apply();
      }, this);

      // HTML Bindings
      //
      loadMoreLink.click(function () {
        CommentsService.API.fetchHistory(scope.roomId, {sorting: 'DESC'});
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
      templateUrl: '/views/rb-comments/standard-comments.html',
      transclude: true,
      scope: {
        stream: '=',
        room: '='
      },
      link: link
    };
  })

  .directive('standardComment', function () {
    return {
      templateUrl: '/views/rb-comments/standard-comment.html'
    }
  })

  .directive('highlightNewComment', function ($timeout) {
    function link (scope, element, attrs) {
      scope.$on('incomming-message', function () {
        element.addClass('new-comment');
        $timeout(function () {
          element.removeClass('new-comment');
        }, 1500);
      });
    };

    return {
      link: link
    }
  });
