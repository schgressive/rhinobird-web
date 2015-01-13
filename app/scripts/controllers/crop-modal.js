'use strict';

angular.module('rhinobird.controllers')
  .controller('CropModalCtrl', function (type, $modalInstance, crop) {
    var vm = this;

      vm.myCroppedImage = "";
      vm.originalImage = "";
      vm.type = type;
      vm.crop = crop;

      vm.save = function(selectedImage) {
        $modalInstance.close(selectedImage);
      };

      vm.cancel = function () {
        $modalInstance.dismiss('cancel');
      };
  });

