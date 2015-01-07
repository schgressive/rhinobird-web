'use strict';

angular.module('rhinobird.controllers')
  .controller('CropModalCtrl', function (type, $scope, $modalInstance) {
      $scope.myCroppedImage = "";
      $scope.originalImage = "";
      $scope.type = type;

      $scope.save = function(selectedImage) {
        $modalInstance.close(selectedImage);
      };

      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };
  });

