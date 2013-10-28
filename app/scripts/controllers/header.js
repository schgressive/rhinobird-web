'use strict';

angular.module('peepoltvApp')
  .controller('HeaderCtrl', function ($scope, $location, $rootScope, $modal, authService, streamService) {

    $scope.$on('$locationChangeSuccess', function (){
      var path = $location.path();
      var match = path.match(/(?:explore|channels|peepol|golive)/);
      $scope.section = (match)? match[0] : 'explore';
    });

    // Catch the unauthorized pages
    $rootScope.$on('$routeChangeError', function (event, parameters) {
      if(parameters.$$route.controller === "GoliveCtrl"){
        // Go to golive after loging in
        $scope.goLive();
      }
    });

    // The user
    $scope.user = authService.user;

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

    // flag for going live
    $scope.goLiveAfterLogin = false;

    // launches the Go Live if the user is logged in
    $scope.goLive = function() {
      $scope.goLiveAfterLogin = false;
      if ($scope.user && $scope.user.email) {
        $location.path("/golive");
      } else {
        $scope.openLoginModal();
        $scope.goLiveAfterLogin = true;
      }
    }

    // Close callback
    var closeLoginModalCallback = function(){
      if ($scope.goLiveAfterLogin && $scope.user && $scope.user.email) {
        $scope.goLive();
      }
    };

    // Login in and signing up
    $scope.openLoginModal = function(){
      $scope.loginModalAction = 'login';
      // Options for the modal
      $scope.loginModal = $modal.open({
        backdrop: 'static',
        templateUrl: '/views/snippets/login-signup-modal.html',
        scope: $scope
      });

      $scope.loginModal.result.then(closeLoginModalCallback)
    };

    $scope.logout = function(){
      if(authService.user.email){

        authService.resource.logout(function(){
          authService.user.email = null;
          authService.user.name = null;
        });

      }
    };
  });
