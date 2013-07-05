'use strict';

angular.module('peepoltvApp')
  .controller('HeaderCtrl', function ($scope, $location, $rootScope, authService) {

    $scope.$on('$locationChangeSuccess', function (){
      var path = $location.path();
      var match = path.match(/(?:explore|channels|peepol|golive)/);
      $scope.section = (match)? match[0] : 'explore';
    });

    // Show options
    $rootScope.streamingOptions = {
      show: false
    };
    $scope.toggleOptions = function(){
      $rootScope.streamingOptions.show = !$rootScope.streamingOptions.show;
    };

    // Options for the modal
    $scope.loginModalOpts = {
      backdropFade: true,
      dialogFade:true
    };

    // Login in and signing up
    $scope.openLoginModal = function(){
      $scope.loginModalInit = true;
      $scope.$$childHead.loginModalAction = 'login';
    };

    // Close callback
    $scope.closeLoginModalCallback = function(){
      $scope.loginModalInit = false;
    };

    $scope.logout = function(){
      if(authService.user.email){

        authService.resource.logout(function(){
          authService.user.email = null;
          authService.user.name = null;
        });

      }
    };

    // The user
    $scope.user = authService.user;
  });
