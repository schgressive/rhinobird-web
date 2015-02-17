'use strict';

angular.module('rhinobird.controllers')
  .controller('VjSessionCtrl', function ($scope, vj) {

    $scope.self = $scope;

    // The vj
    $scope.vj = vj;

    // The current user
    $scope.user = vj.user;

    $scope.like = function() {
      vj.toggleLike();
    }

    $scope.repost = function() {
      vj.repost();
    }


    $scope.reposted = function() {
      return vj.reposted;
    }

    $scope.liked = function() {
      return vj.liked;
    }
  });
