'use strict';

angular.module('peepoltvApp', ['ngResource'])
  .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider
      .when('/', {
        templateUrl: '/views/main.html',
        controller: 'MainCtrl'
      })
      .when('/stream', {
        templateUrl: '/views/channels.html',
        controller: 'ChannelsCtrl'
      })
      .when('/search', {
        templateUrl: '/views/search-results.html',
        controller: 'SearchResultsCtrl'
      })
      .when('/golive', {
        templateUrl: '/views/golive.html',
        controller: 'GoliveCtrl'
      })
      .when('/streams/:streamId', {
        templateUrl: '/views/stream.html',
        controller: 'StreamCtrl'
      })
      .when('/channels', {
        templateUrl: '/views/channels.html',
        controller: 'ChannelsCtrl'
      })
      .when('/channels/:section', {
        templateUrl: '/views/channels.html',
        controller: 'ChannelsCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);
