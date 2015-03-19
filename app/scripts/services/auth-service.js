'use strict';

angular.module('rhinobird.services')
  .service('AuthService', function AuthService($modal, $rootScope, User, Session, Password, Confirmation, $state) {

    // The current session
    var session = Session.$build({id: 'current'});

    // The logged user
    this.user = session.user;

    // Login in and signing up
    this.askLogin = function(action, copyScopeVariables){
      var defaultAction = action || 'login';

      var newModalDefaults  = {
        backdrop: 'static',
        templateUrl: '/views/modals/login-signup-modal.html'
      };

      newModalDefaults.controller = ['$scope', '$modalInstance', function($scope, $modalInstance) {

        // copy scope variables
        if (copyScopeVariables) {
          for (var i in copyScopeVariables) {
            $scope[i] = copyScopeVariables[i];
          }
        }

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

    this.sendConfirmation = function(payload) {
      var confirmation = Confirmation.$create(payload);

      return confirmation.$promise;
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
        };
      }];

      //create modal and return it
      return $modal.open(newModalDefaults).result;
    };

    this.resetPassword = function(payload) {
      var password = Password.$build(payload);
      password.$pk = 'current';
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
      session.auth_token = payload.authentication_token;

      // Do login
      session.$save().$finally(broadcastSessionChanged);

      return session.$promise;
    };

    // private method to logout an authenticated user
    this.logout = function() {
      // Destroy de session
      session.$destroy().$then(function() {
        $state.go('main.world');
      }).$finally(broadcastSessionChanged);
      return session.$promise;
    };

    // Get the current session
    this.getSession = function(){
      session.$fetch().$finally(broadcastSessionChanged);
      return session.$promise;
    };

    // Broadcase a message that the session has changed
    var broadcastSessionChanged = function(){
      var status = session.$status !== "error";
      $rootScope.$broadcast('sessionChanged', session, status);
    };
  });
