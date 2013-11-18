'use strict';

angular.module('peepoltvApp')
  .controller('HeaderCtrl', function ($scope, $location, $rootScope, AuthService, streamService) {

    $scope.$on('$locationChangeSuccess', function (){
      var path = $location.path();
      var match = path.match(/(?:explore|channels|peepol|golive)/);
      $scope.section = (match)? match[0] : 'explore';
    });

    // Catch the unauthorized pages
    $rootScope.$on('$routeChangeError', function (event, parameters) {
      if(parameters.$$route.controller === "GoliveCtrl"){
        // Go to golive after loging in
        AuthService.askLogin().then(function() {
          $location.path("/golive");
        })
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
    }

    $scope.logout = function(){
      AuthService.logout();
    };
  });
