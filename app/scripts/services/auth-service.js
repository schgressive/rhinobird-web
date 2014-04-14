'use strict';

angular.module('rhinobird.services')
  .service('AuthService', function AuthService($modal, $rootScope, User, Session, Password) {

    // The current session
    var session = Session.$build({id: 'current'});

    // The logged user
    this.user = session.user;

    // Login in and signing up
    this.askLogin = function(action){
      var defaultAction = action || 'login';

      var newModalDefaults  = {
        backdrop: 'static',
        templateUrl: '/views/modals/login-signup-modal.html'
      };

      newModalDefaults.controller = ['$scope', '$modalInstance', function($scope, $modalInstance) {
        //set default action to login
        $scope.loginModalAction = defaultAction;

        //click event for login modal form
        $scope.close = function() {
          $modalInstance.dismiss('cancel');
        };
      }];

      //create modal and return it
      return $modal.open(newModalDefaults).result;

    };

    this.askPasswordReset = function(payload) {
      var password = Password.$create(payload);

      return password.$promise;
    };

    this.finishSocialSignup = function(network) {
      var newModalDefaults  = {
        backdrop: 'static',
        templateUrl: '/views/modals/social-modal.html'
      };

      newModalDefaults.controller = ['$scope', '$modalInstance', function($scope, $modalInstance) {

        $scope.network = network;

        //click event for login modal form
        $scope.close = function() {
          $modalInstance.dismiss('cancel');
        }
      }];

      //create modal and return it
      return $modal.open(newModalDefaults).result;
    }

    this.resetPassword = function(payload) {
      var password = Password.$build(payload);
      password.$pk = undefined;
      password.$save();


      return password.$promise;
    };

    // Register user
    this.register = function(payload) {
      var user = User.$build(payload);
      user.$pk = undefined;
      user.$save();

      return user.$promise;
    };

    // Login a user, create a new session
    this.login = function(payload){
      // Set id to undefined to force POST on save
      session.$pk = undefined;

      // Set the login information
      session.email = payload.email;
      session.password = payload.password;

      // Do login
      session.$save().$finally(broadcastSessionChanged);

      return session.$promise;
    };

    // private method to logout an authenticated user
    this.logout = function() {
      // Destroy de session
      session.$destroy().$finally(broadcastSessionChanged);
      return session.$promise;
    };

    // Get the current session
    this.getSession = function(){
      session.$fetch().$finally(broadcastSessionChanged);
      return session.$promise;
    };

    // Broadcase a message that the session has changed
    var broadcastSessionChanged = function(){
      var status = session.hasOwnProperty('authToken');
      $rootScope.$broadcast('sessionChanged', session, status);
    };
  });
