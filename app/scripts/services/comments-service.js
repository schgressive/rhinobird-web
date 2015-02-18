'use strict';

angular.module('rhinobird.services')
  .service('CommentsService', function CommentsService($window, AuthService, $rootScope) {

    var user = AuthService.user;

    var rbComments = new $window.RbComments.API({
      socketLib:        ioSafe,
      host:             '/comments_app_host',
      libPath:          '/comments_app_host/socket.io',
      auth_token:       user.authenticationToken
    });

    $rootScope.$on('sessionChanged', function(event, session, logginStatus) {
      rbComments.updateSession(session.authToken);
    });

    this.API = rbComments;
  });
