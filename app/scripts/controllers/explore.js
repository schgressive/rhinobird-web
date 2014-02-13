'use strict';

angular.module('peepoltv.controllers')
  .controller('ExploreCtrl', function ($scope, GeolocationService, Stream, AuthService, $timeout, $compile) {

    // Set the default marker location
    // FIXME: The markers images should be compiled and served with relative path
    // Maybe we can use awesome markers plugin also
    L.Icon.Default.imagePath = 'http://api.tiles.mapbox.com/mapbox.js/v1.6.0/images';

    // Expose scope as self
    $scope.self = $scope;

    // Expose the user in the scope
    $scope.user = AuthService.user;

    // Map configuration
    $scope.map = {
      defaults:{
        scrollWheelZoom: false,
        tileLayer: 'http://a.tiles.mapbox.com/v3/peepoltv.map-ujvx87td/{z}/{x}/{y}.png',
        tileLayerOptions: {
          attribution: '&copy; <a href="http://www.mapbox.com">Mapbox</a>'
        }
      },
      search: {
        lat: 0,
        lng: 0,
        zoom: 2
      },
      events: {
        map: {
          enable: ['popupopen'],
          logic: 'emit'
        }
      }
    };

    /**
     * Get the current locations
     */
    $scope.getCurrent = function (){
      return GeolocationService.getCurrent().then(function(data){
        angular.extend($scope.map.search, {
          lat: data.lat,
          lng: data.lng,
          zoom: 16
        });
      });
    };

    /**
     * Search for an address
     */
    $scope.searchAddress = function(){
      return GeolocationService.reverseGeocode($scope.address).then(function(data){
        angular.extend($scope.map.search, {
          lat: data.lat,
          lng: data.lng,
          zoom: (data.type && data.type !== 'street_address' && data.type !== 'route')? 13 : 16
        });
      });
    };

    // Expose the current location in the scope
    $scope.getCurrent();

    // Set the stream collection
    $scope.streams = Stream.$collection({ live: true, archived: true });

    // Search for stream when lat change
    $scope.$watch('map.search.lat', function(){
      // Get the streams
      $scope.streams.$refresh($scope.map.search);
    });


    // Search for stream when zoom change
    $scope.$watch('kms', function(){
      var searchParams = angular.extend($scope.map.search, {
        range: $scope.kms
      });

      // Get the streams
      $scope.streams.$refresh(searchParams);
    });

    // Expose geoJSON collection in the scope
    $scope.streams.$on('after-fetch-many', function(){
      $scope.map.geoJSON = {
        data: this.asGeoJSON(),
        onEachFeature: function(feature, layer){
          // Create get the view template
          var popupContent = '<div ng-include="\'/views/templates/map-stream-popup.html\'"></div>';

          // Bind the popup
          // HACK: I have added the stream in the popup options
          layer.bindPopup(popupContent,{
            closeButton: false,
            minWidth: 200,
            feature: feature
          });
        }
      };
    });

    $scope.$on('leafletDirectiveMap.popupopen', function(event, leafletEvent){

      // Create the popup view when is opened
      var feature = leafletEvent.leafletEvent.popup.options.feature;

      var newScope = $scope.$new();
      newScope.stream = feature;

      $compile(leafletEvent.leafletEvent.popup._contentNode)(newScope);
    });

  });
