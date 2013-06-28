'use strict';

angular.module('peepoltvApp')
  .controller('HeaderCtrl', function ($scope, $location) {

    $scope.$on('$locationChangeSuccess', function (){
      var path = $location.path();
      var match = path.match(/(?:explore|channels|peepol|golive)/);
      $scope.section = (match)? match[0] : 'explore';
    });
  });
