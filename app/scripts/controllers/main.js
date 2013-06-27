'use strict';

angular.module('peepoltvApp')

  .controller('MainCtrl', ['$scope', 'streamService', 'geolocation', function ($scope, streamService, geolocation) {

    // Change the location when is changed
    $scope.$on('locationChanged', function (event, parameters) {

      $scope.coords= parameters.coordinates;
      map.setView(new L.LatLng($scope.coords.latitude, $scope.coords.longitude), 30 );
    });

    // Get current location
    geolocation();

    // Create map
    var map = L.mapbox.map('map', 'peepoltv.map-ujvx87td');

    // Disable scroll to zoom
    map.scrollWheelZoom.disable();

    // Get the streams based on geolocation
    streamService.resource.search({}, function(r){
        r = r.reverse();
        $scope.streams = _.map(r, function(s){
          s.properties['marker-size'] = 'medium';
          s.properties['marker-color'] = '#aa56ff';
          s.properties['marker-symbol'] = 'cinema';
          return s;
        });

        // Create and add marker layer
        var markerLayer = L.mapbox.markerLayer();
        markerLayer.setGeoJSON({
          type: 'FeatureCollection',
          features: $scope.streams
        });
        markerLayer.addTo(map);

        markerLayer.eachLayer(function(marker) {
          var feature = marker.feature;

          // Create custom popup content
          var popupContent = '<a target="_blank" href="' + feature.url + '">' +
                              '<h3>' + feature.title + '</h3>' +
                             '</a>';

          // http://leafletjs.com/reference.html#popup
          marker.bindPopup(popupContent,{
            closeButton: false,
            minWidth: 320
          });

        });

        // Set inital center and zoom
        map.fitBounds(markerLayer.getBounds());
      });
  }]);
