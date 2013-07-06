'use strict';

angular.module('peepoltvApp')

  .controller('MainCtrl', function ($scope, streamService, geolocation) {

    // Change the location when is changed
    $scope.$on('locationChanged', function (event, parameters) {
      var zoom = 30;
      if(parameters.type && parameters.type !== 'street_address' && parameters.type !== 'route'){
        zoom = 13;
      }
      map.setView(new L.LatLng(parameters.coords.lat, parameters.coords.lng), zoom );
    });

    // Get current location
    $scope.geolocation = geolocation;
    geolocation.getCurrent();

    // Create map
    var map = L.mapbox.map('map', 'peepoltv.map-ujvx87td');
	
    // Disable scroll to zoom
    map.scrollWheelZoom.disable();

    // Get the streams based on geolocation
    streamService.resource.search({}, function(r){
        r = r.reverse();
        $scope.streams = _.map(r, function(s){
          s.properties['marker-size'] = 'medium';
          s.properties['marker-color'] = '#A954F5';
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
          var popupContent = '<div class="popup clearfix">' +
          						'<div class="popup-left pull-left">' +
          							'<div class="video-popup">' +
          								'<a href="' + feature.url + '">' +
											'<img src="http://fakeimg.pl/274x118/?text=StreamIMG">' +
										'</a>' +
          							'</div>' +
          							'<div class="specs-popup clearfix">' +
          								'<ul class="no-bullets">' +
          									'<li class="thumb-user pull-left">' + 
          										'<a href="#">' +
													'<img src="http://fakeimg.pl/58x58/?text=User">' +
												'</a>' +
          									'</li>' +
          									'<li class="specs-title">' + feature.title + '</li>' +
          									'<li class="specs-tags">tags go here</li>' +
          								'</ul>' +
          							'</div>' +
		  						'</div>' +
		  						'<div class="popup-right pull-left">' +
		  							'<a target="_blank" href="' + feature.url + '">' +
		  								'<button class="play-btn"><span class="visually-hidden">click to play video</span></button>' +
		  							'</a>' +
		  						'</div>' +
                             '</div>';

          // http://leafletjs.com/reference.html#popup
          marker.bindPopup(popupContent,{
            closeButton: false,
            minWidth: 320
          });

        });

        // Set inital center and zoom
        //map.fitBounds(markerLayer.getBounds());
      });

    // Address search
    // $scope.address defined in the view
    $scope.searchAddress = function(){
      geolocation.reverseGeocode($scope.address);
    };

    $scope.getCurrent = function(){
      $scope.address = '';
      geolocation.getCurrent();
    };
  });
