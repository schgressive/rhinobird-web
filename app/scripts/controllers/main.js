'use strict';

angular.module('peepoltvApp')
  .controller('MainCtrl', ['$scope', 'Streams', function ($scope, Streams) {

    // Temporary thubnails
    var tmpThumbs = ['fopr63yr3ps', 'VgPBse5BkA8', 'NR7JUM23WN8'];

    // Create map
    var map = mapbox.map('map');
    map.addLayer(mapbox.layer().id('peepoltv.map-ujvx87td'));

    // Get the streams basen on geolocation
    Streams.search({}, function(r){
        $scope.streams = _.map(r, function(s, k){
          s.thumb = tmpThumbs[k];
          s.properties['marker-size'] = 'medium';
          s.properties['marker-color'] = '#aa56ff';
          return s;
        });


        // Create and add marker layer
        var markerLayer = mapbox.markers.layer();
        var interaction = mapbox.markers.interaction(markerLayer);
        map.addLayer(markerLayer);

        markerLayer.features(r);

        // Set a custom formatter for tooltips
        // Provide a function that returns html to be used in tooltip
        interaction.formatter(function(feature) {
          var o = '<a target="_blank" href="' + feature.url + '">' +
            '<img src="http://img.youtube.com/vi/' + feature.thumb + '/1.jpg" />' +
            '<h3>' + feature.title + '</h3>' +
            '</a>';

          return o;
        });

        // Set inital center and zoom
        map.setExtent(markerLayer.extent());

      });
  }]);
