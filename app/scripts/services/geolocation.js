'use strict';

/* global google: false */

angular.module('peepoltvApp')
.factory('geolocation', function($q, $rootScope) {

  var changeLocation = function (data, type) {
    $rootScope.$broadcast('locationChanged', {
      coords: data,
      type: type
    });
  };

  var current = {};

  return {
    reverseGeocode: function(address){
      var geocoder = new google.maps.Geocoder();

      geocoder.geocode( {'address': address}, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK){
          $rootScope.$apply(function () {
            changeLocation({
              lat: results[0].geometry.location.lat(),
              lng: results[0].geometry.location.lng(),
            }, results[0].types[0]);
          });
        }
        else {
          console.log('address not found')
        }
      });

    },
    getCurrent: function() {

      try {
        if (navigator.geolocation) {

          // If current already exists
          if(current.lat && current.lng){
            changeLocation(current);
            return;
          }

          navigator.geolocation.getCurrentPosition(
            function (position) {
              $rootScope.$apply(function () {
                current.lat = position.coords.latitude;
                current.lng = position.coords.longitude;

                changeLocation(current);
              });
            },
            function (error) {
              console.log('geolocation error', error);
            }
            );
        }
        else {
          console.log('location services not allowed');
        }
      }
      catch (err) {
        console.log('geolocation error');
      }
    }

  };
});
