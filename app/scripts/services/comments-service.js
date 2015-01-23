'use strict';

angular.module('rhinobird.services')
  .service('CommentsService', function CommentsService($window, AuthService) {

    var user = AuthService.user;

    var rbComments = new $window.RbComments.API({
      socketLib:        ioSafe,
      host:             '/comments_app_host',
      libPath:          '/comments_app_host/socket.io',
      auth_token:       user.authenticationToken
    });

    this.API = rbComments;
  });
