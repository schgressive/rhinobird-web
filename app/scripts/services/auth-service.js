'use strict';

angular.module('peepoltvApp')
  .service('authService', function authService($resource, $q, settings, $modal) {

    // Defines API methods
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

    //Holds current logged user
    var user = {};

    // Login in and signing up
    var openLoginModal = function(){

      var newModalDefaults  = {
        backdrop: 'static',
        templateUrl: '/views/snippets/login-signup-modal.html'
      };

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

    // private method to logout an authenticated user
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
