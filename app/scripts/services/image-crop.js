'use strict';

angular.module('rhinobird.services').
  factory('ImageCrop', function($modal, $log, $q) {
    var image;

    return {
      open: open,
      image: image
    }

    function open(type, crop) {

      var deffered = $q.defer();

      var modalInstance = $modal.open({
        templateUrl: '/views/modals/partial-image-crop.html',
        windowClass: 'modal-edit',
        controller: "CropModalCtrl as vm",
        resolve: {
          crop: function() {
            return crop;
          },
          type: function() {
            return type;
          }
        }
      });

      modalInstance.result.then(function (selectedImage) {
         image = selectedImage;
         deffered.resolve(image)
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
        deffered.reject();
      });

      return deffered.promise;
    }
});

