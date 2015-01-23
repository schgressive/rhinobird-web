'use strict';

angular.module('rhinobird.directives')
  .directive('standardComments', function ($window, $compile) {

    function link (scope, element, attrs) {

      // Helpers
      //
      function prepareMessageForDisplay(message) {
        if (message.user.photo == "null")
            message.user.photo = null;

        return message;
      }

      // Comments API hook and Room identifier
      var CommentsAPI = scope.CommentsService.API,
          roomId = scope.stream.id;

      // Keep a track of fetched comments
      scope.comments = [];

      // HTML Elements
      //
      var loadMoreLink = element.find('.rb-load-more'),
          submitForm   = element.find('.rb-comments-form'),
          textInput    = element.find('.rb-comments-input');

      // API Bindings
      //
      CommentsAPI.on('incomming-history', function (history) {
        for (var i=0; i<history.messages.length; i++) {
          scope.comments.push(prepareMessageForDisplay(history.messages[i]));
        }
        scope.$apply();
      }, this);

      CommentsAPI.on('end-of-history', function (history) {
        loadMoreLink.hide();
      }, this);

      CommentsAPI.on('incomming-message', function (message) {
        textInput.val('');
        scope.comments.unshift(prepareMessageForDisplay(message));
        scope.$apply();
      }, this);

      // HTML Bindings
      //
      loadMoreLink.click(function () {
        CommentsAPI.fetchHistory(roomId, {sorting: 'DESC'});
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
      templateUrl: '/views/rb-comments/standard-comments.html',
      link: link
    };
  })

  .directive('standardComment', function () {
    return {
      templateUrl: '/views/rb-comments/standard-comment.html'
    }
  });
