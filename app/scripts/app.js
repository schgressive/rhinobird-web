'use strict';

angular.module('peepoltvApp', ['ngResource'])
  .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider
      .when('/', {
        templateUrl: '/views/main.html',
        controller: 'MainCtrl'
      })
      .when('/explore', {
        templateUrl: '/views/main.html',
        controller: 'MainCtrl'
      })
      .when('/peepol', {
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
        controller: 'GoliveCtrl',
        section: 'golive'
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
  }])
  .run(['$location', '$rootScope', function($location, $rootScope){
    $rootScope.$on('$routeChangeSuccess', function(event, current){
      $rootScope.section = current.$$route.section || null;
    });
  }]);
