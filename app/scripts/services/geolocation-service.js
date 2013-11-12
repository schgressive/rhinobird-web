'use strict';

/* global google: false */

angular.module('peepoltvApp')
.service('GeolocationService', function($q, $rootScope) {

  var current = {};
  var resolved = false;

  this.resolved = resolved;
  this.current = current;

  this.getCurrent = function() {

    try {
      if (navigator.geolocation) {

        var deferred = $q.defer();

        // If current already exists
        if(resolved){
          deferred.resolve(current);
          return deferred.promise;
        }

        // Ask the browse for the position
        navigator.geolocation.getCurrentPosition(
          // On success
          function (position) {
            $rootScope.$apply(function(){
              angular.extend(current, {
                lat: position.coords.latitude,
                lng: position.coords.longitude
              });

              // Set resolve flag after getting the location
              resolved = true;

              deferred.resolve(current);
            });

          },
          // On error
          function (error) {
            $rootScope.$apply(function(){
              deferred.reject({
                error: error,
                message: 'geolocation error'
              });
            });
          }
        );

        return deferred.promise;
      }
      else {
        console.log('location services not allowed');
      }
    }
    catch (err) {
      console.log('geolocation error');
    }
  };

  this.reverseGeocode = function(address){
    var geocoder = new google.maps.Geocoder();
    var deferred = $q.defer();

    geocoder.geocode( {'address': address}, function(results, status) {
      if (status === google.maps.GeocoderStatus.OK){
        $rootScope.$apply(function(){
          deferred.resolve({
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng(),
            type: results[0].types[0]
          });
        });
      }
      else {
        console.log('address not found');
        $rootScope.$apply(function(){
          deferred.reject({
            message: 'address not found'
          });
        });
      }
    });

    return deferred.promise;

  };
});
