'use strict';

angular.module('peepoltv.controllers')
  .controller('ExploreCtrl', function ($scope, GeolocationService, Stream, AuthService, $timeout) {

    $scope.self = $scope;

    $scope.user = AuthService.user;

    // // Get the streams based on geolocation
    // var drawStreamsLayer = function(streams, map){

    //   markerLayer.eachLayer(function(marker) {
    //     var feature = marker.feature;

    //     // Create custom popup content
    //     var popupContent = '<div class="popup clearfix">' +
    //                   '<div class="popup-left pull-left">' +
    //                     '<div class="video-popup">' +
    //                       '<a href="/streams/{{stream.id}}">' +
    //                   '<img src="' + feature.thumbs.medium + '">' +
    //                 '</a>' +
    //                     '</div>' +
    //                     '<div class="specs-popup clearfix">' +
    //                       '<ul class="no-bullets">' +
    //                         '<li class="thumb-user pull-left">' +
    //                           '<a href="#" title="username">' +
    //                       '<img src="http://fakeimg.pl/54x54/?text=User">' +
    //                     '</a>' +
    //                         '</li>' +
    //                         '<li class="specs-title">' + feature.title + '</li>' +
    //                         '<li class="specs-tags">' + feature.tags.join(', ') + '</li>' +
    //                       '</ul>' +
    //                     '</div>' +
    //               '</div>' +
    //               '<div class="popup-right pull-left">' +
    //                 '<a target="_blank" href="/streams/' + feature.id + '">' +
    //                   '<button class="play-btn"><span class="visually-hidden">click to play video</span></button>' +
    //                 '</a>' +
    //               '</div>' +
    //                          '</div>';

    //     // http://leafletjs.com/reference.html#popup
    //     marker.bindPopup(popupContent,{
    //       closeButton: false,
    //       minWidth: 320
    //     });

    //   });
    // };
    //

    // Map configuration
    $scope.map = {
      defaults:{
        scrollWheelZoom: false,
        tileLayer: 'http://a.tiles.mapbox.com/v3/peepoltv.map-ujvx87td/{z}/{x}/{y}.png',
        tileLayerOptions: {
          attribution: '&copy; <a href="http://www.mapbox.com">Mapbox</a>'
        },
      },
      search: {
        lat: 0,
        lng: 0,
        zoom: 2
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
    $scope.streams = Stream.$collection();

    // Search for stream when lat change
    $scope.$watch('map.search.lat', function(){
      // Get the streams
      $scope.streams.$refresh($scope.map.search);
    });


    // Search for stream when zoom change
    $scope.$watch('map.search.zoom', function(){
      var searchParams = angular.extend($scope.map.search, {
        range: 1
      });

      // Get the streams
      $scope.streams.$refresh(searchParams);
    });

    // Expose geoJSON collection in the scope
    $scope.streams.$on('after-fetch-many', function(){
      $scope.map.geoJSON = {
        data: this.asGeoJSON()
      };
    });

  });
