'use strict';

angular.module('peepoltvApp')
  .service('authService', function authService($resource, $q, settings, $modal) {
    var resource = $resource(settings.apiHost + '/sessions', {}, {
      'register': {
        method: 'POST',
        params: {},
        url: settings.apiHost + '/registration',
        withCredentials: true
      },
      'login': {
        method: 'POST',
        params: {},
        withCredentials: true
      },
      'status': {
        method: 'GET',
        params: {},
        withCredentials: true
      },
      'logout':{
        method: 'DELETE',
        params: {},
        withCredentials: true
      }
    });

    var user = {};
    var loginModal = null;
    var modalDefaults = {
        backdrop: 'static',
        templateUrl: '/views/snippets/login-signup-modal.html'
    };

    // Login in and signing up
    var openLoginModal = function(){

      var newModalDefaults  = {};

      angular.extend(newModalDefaults, modalDefaults);

      newModalDefaults.controller = function($scope, $modalInstance) {
        //set default action to login
        $scope.loginModalAction = 'login';

        //click event for login modal form
        $scope.close = function() {
          $modalInstance.dismiss('cancel');
        }
      }

      //create modal and return it
      return $modal.open(newModalDefaults).result;

    };

    var logout = function() {
      if(user.email){

        resource.logout(function(){
          user.email = null;
          user.name = null;
        });

      }
    };

    // Public API here
    return {
      resource: resource,
      askLogin: openLoginModal,
      logout: logout,
      user: user
    };
  });
