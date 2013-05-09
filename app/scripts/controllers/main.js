'use strict';

angular.module('peepoltvApp')
  .controller('MainCtrl', ['$scope', 'Streams', function ($scope, Streams) {

    // Create map
    var map = L.mapbox.map('map', 'peepoltv.map-ujvx87td');

    // Get the streams basen on geolocation
    Streams.search({}, function(r){
        $scope.streams = _.map(r, function(s){
          s.properties['marker-size'] = 'medium';
          s.properties['marker-color'] = '#aa56ff';
          return s;
        });

        // Create and add marker layer
        var markerLayer = L.mapbox.markerLayer($scope.streams);
        markerLayer.addTo(map);

        markerLayer.eachLayer(function(marker) {
          var feature = marker.feature;

          // Create custom popup content
          var popupContent = '<a target="_blank" href="' + feature.url + '">' +
                              '<img src="' + feature.thumbs.small + '" />' +
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
