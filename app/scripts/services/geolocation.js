'use strict';

angular.module('peepoltvApp')
.factory('geolocation', ['$q', '$rootScope', function($q, $rootScope) {
  return function() {
    var changeLocation= function (coords) {
      $rootScope.$broadcast('locationChanged', {
        coordinates: coords
      });
    };
    var d = $q.defer();

    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          function (position) {
            $rootScope.$apply(function () {
              //var longitude = position.coords.longitude;
              changeLocation(position.coords);
              d.resolve({
                aField: 'Hello ' + position.coords.longitude + '!'
              });
            });
          },
          function (error) {
            d.reject(error);
          }
          );
      }
      else {
        d.reject('location services not allowed');
      }
    }
    catch (err) {
      d.reject(err);
    }

    return d.promise;

  };
}]);
