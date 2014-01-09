'use strict';

angular.module('peepoltv')
  .controller('HeaderCtrl', function ($scope, $location, $rootScope, AuthService) {

    // Catch the unauthorized pages
    $rootScope.$on('$routeChangeError', function (event, parameters) {
      if(parameters.$$route.controller === 'GoliveCtrl'){
        // Go to golive after loging in
        AuthService.askLogin().then(function() {
          $location.path('/golive');
        });
      }
    });

    // The user
    $scope.user = AuthService.user;

    // Show options
    $rootScope.streamingOptions = {
      show: false
    };
    $scope.toggleOptions = function(){
      $rootScope.streamingOptions.show = !$rootScope.streamingOptions.show;
    };

    // Emit stop broadcast event
    $scope.stopBroadcast = function(stay){
      $rootScope.$broadcast('liveStreamStopped', { stay: stay});
    };

    $scope.login = function(){
      AuthService.askLogin();
    };

    $scope.logout = function(){
      AuthService.logout();
    };
  });
