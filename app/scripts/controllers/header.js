'use strict';

angular.module('peepoltv.controllers')
  .controller('HeaderCtrl', function ($scope, $location, $rootScope, AuthService, $state) {

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

    $scope.golive = function() {
      if ($state.includes('golive') && !$scope.app.onAir) {
        $rootScope.$broadcast('golive', {});
      } else {
        $state.go('golive');
      }
    }

    $scope.login = function(){
      AuthService.askLogin();
    };

    $scope.logout = function(){
      AuthService.logout();
    };
  });
