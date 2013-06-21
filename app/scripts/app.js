'use strict';

angular.module('peepoltvApp', ['ngResource'])
  .config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/channels', {
        templateUrl: 'views/channels.html',
        controller: 'ChannelsCtrl'
      })
      .when('/search-results', {
        templateUrl: 'views/search-results.html',
        controller: 'SearchResultsCtrl'
      })
      .when('/golive', {
        templateUrl: 'views/golive.html',
        controller: 'GoliveCtrl'
      })
      .when('/streams/:streamId', {
        templateUrl: 'views/stream.html',
        controller: 'StreamCtrl',
        resolve: {
          stream: function(streamService, $route) {
            return streamService.resolve($route.current.params.streamId);
          }
        }
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);
