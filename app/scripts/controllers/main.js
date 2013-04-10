'use strict';

angular.module('peepoltvApp')
  .controller('MainCtrl', ['$scope', 'Streams', function ($scope, Streams) {

    // Create map
    var map = mapbox.map('map');
    map.addLayer(mapbox.layer().id('peepoltv.map-ujvx87td'));

    // Get the streams basen on geolocation
    Streams.search({}, function(r){
        $scope.streams = r;

        // Create features bases on streams
        // Evaluate if the api should return geojsons
        var features = _.map(r, function(stream){
          return {
            geometry: { 'type': 'Point', 'coordinates': [stream.lng, stream.lat]},
            properties: {
                // these properties customize the look of the marker
                // see the simplestyle-spec for a full reference:
                // https://github.com/mapbox/simplestyle-spec
                'marker-color': '#000',
                'marker-symbol': 'star-stroked',
                title: stream.title,
                description: 'This is a single marker.',
                url: 'streams.peepol.tv/51d1bc8ab4c5297843ea3f57b7800b30'
              }
            };
        });

        // Create and add marker layer
        var markerLayer = mapbox.markers.layer();
        var interaction = mapbox.markers.interaction(markerLayer);
        map.addLayer(markerLayer);

        markerLayer.features(features);

        // Set a custom formatter for tooltips
        // Provide a function that returns html to be used in tooltip
        interaction.formatter(function(feature) {
          var o = '<a target="_blank" href="' + feature.properties.url + '">' +
            '<img src="' + feature.properties.image + '">' +
            '<h2>' + feature.properties.title + '</h2>' +
            '</a>';

          return o;
        });

        // Set iniital center and zoom
        map.centerzoom({
            lat: r[0].lat,
            lon: r[0].lng
          }, 13);

      });
  }]);
