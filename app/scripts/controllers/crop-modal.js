'use strict';

angular.module('rhinobird.controllers')
  .controller('CropModalCtrl', function (type, $scope, $modalInstance, crop) {
      $scope.myCroppedImage = "";
      $scope.originalImage = "";
      $scope.type = type;
      $scope.crop = crop;

      $scope.save = function(selectedImage) {
        $modalInstance.close(selectedImage);
      };

      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };
  });

