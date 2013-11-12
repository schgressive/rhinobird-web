'use strict';

angular.module('peepoltvApp')
  .controller('ExploreCtrl', function ($scope, GeolocationService, streamService, authService) {

		$scope.user = authService.user;

    $scope.mapSearch = {};

    // Change the location when is changed
    $scope.$watchCollection('mapSearch', function (value) {
      if(!value.lat && !value.lng){
        return;
      }

      // Create map
      if(!$scope.map){
        $scope.map = L.mapbox.map('map', 'peepoltv.map-ujvx87td');
      }

      // Disable scroll to zoom
      $scope.map.scrollWheelZoom.disable();

      var zoom = 16;
      if(value.type && value.type !== 'street_address' && value.type !== 'route'){
        zoom = 13;
      }
      $scope.map.setView(new L.LatLng(value.lat, value.lng), zoom );
    });

    // Get current location
    GeolocationService.getCurrent().then(function(data){
      angular.extend($scope.mapSearch, {
        lat: data.lat,
        lng: data.lng
      });
    });

    $scope.getCurrent = function(){
      $scope.address = '';
      GeolocationService.getCurrent().then(function(data){
        angular.extend($scope.mapSearch, {
          lat: data.lat,
          lng: data.lng
        });
      });
    };

    // Address searchAddress
    // $scope.address defined in the view
    $scope.searchAddress = function(){
      GeolocationService.reverseGeocode($scope.address).then(function(data){
        angular.extend($scope.mapSearch, {
          lat: data.lat,
          lng: data.lng,
          type: data.type
        });
      });
    };

    // Get the streams based on geolocation
    streamService.resource.search({}, function(r){
        $scope.streams = _.map(r, function(s){
          s.properties['marker-size'] = 'medium';
          s.properties['marker-color'] = '#A954F5';
          s.properties['marker-symbol'] = 'cinema';
          return s;
        });

        if(!$scope.map) return;
        // Create and add marker layer
        var markerLayer = L.mapbox.markerLayer();
        markerLayer.setGeoJSON({
          type: 'FeatureCollection',
          features: $scope.streams
        });
        markerLayer.addTo($scope.map);

        markerLayer.eachLayer(function(marker) {
          var feature = marker.feature;

          // Create custom popup content
          var popupContent = '<div class="popup clearfix">' +
          						'<div class="popup-left pull-left">' +
          							'<div class="video-popup">' +
          								'<a href="/streams/{{stream.id}}">' +
											'<img src="' + feature.thumbs.medium + '">' +
										'</a>' +
          							'</div>' +
          							'<div class="specs-popup clearfix">' +
          								'<ul class="no-bullets">' +
          									'<li class="thumb-user pull-left">' +
          										'<a href="#" title="username">' +
													'<img src="http://fakeimg.pl/54x54/?text=User">' +
												'</a>' +
          									'</li>' +
          									'<li class="specs-title">' + feature.title + '</li>' +
          									'<li class="specs-tags">' + feature.tags.join(", ") + '</li>' +
          								'</ul>' +
          							'</div>' +
		  						'</div>' +
		  						'<div class="popup-right pull-left">' +
		  							'<a target="_blank" href="/streams/' + feature.id + '">' +
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
        //$scope.map.fitBounds(markerLayer.getBounds());
      });


  });
