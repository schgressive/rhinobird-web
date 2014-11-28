'use strict';

angular.module('rhinobird.controllers')
  .controller('HeaderCtrl', function ($scope, $location, $rootScope, AuthService, DetectRTCService, $state) {

    // Catch the unauthorized pages
    $rootScope.$on('$routeChangeError', function (event, parameters) {
      if(parameters.$$route.controller === 'GoliveCtrl'){
        // Go to golive after loging in
        AuthService.askLogin().then(function() {
          $location.path('/golive');
        });
      }
    });

    // RTC alert
    $scope.webRTCAlertDismissed = false;
    $scope.showWebRTCAlert = function(){
      return (!DetectRTCService.isWebRTCSupported && !$scope.webRTCAlertDismissed);
    };

    $scope.dismissWebRTCAlert = function(){
      $scope.webRTCAlertDismissed = true;
    };

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
    $scope.stopBroadcast = function(params){
      $rootScope.$broadcast('liveStreamStopped', params);
    };

    $scope.golive = function() {
      if ($state.includes('golive') && !$scope.app.onAir) {
        $state.reload();
      } else {
        $state.go('golive');
      }
    };

    $scope.login = function(){
      AuthService.askLogin();
    };

    $scope.logout = function(){
      AuthService.logout();
    };
  });
