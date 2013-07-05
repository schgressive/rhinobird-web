'use strict';

angular.module('peepoltvApp', ['ngResource', 'ui.bootstrap', 'licode'])
  .config(function ($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider
      .when('/', {
        templateUrl: '/views/main.html',
        controller: 'MainCtrl',
        section: 'explore'
      })
      .when('/explore', {
        templateUrl: '/views/main.html',
        controller: 'MainCtrl',
        section: 'explore'
      })
      .when('/peepol', {
        templateUrl: '/views/main.html',
        controller: 'MainCtrl',
        section: 'peepol'
      })
      .when('/stream', {
        templateUrl: '/views/channels.html',
        controller: 'ChannelsCtrl',
        section: 'stream'
      })
      .when('/search', {
        templateUrl: '/views/search-results.html',
        controller: 'SearchResultsCtrl',
        section: 'search'
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
  })
  .run(function($location, $rootScope, authService){
    $rootScope.$on('$routeChangeSuccess', function(event, current){
      $rootScope.section = current.$$route.section || null;
    });

    authService.resource.status({}, function(e){
      authService.user.email = e.email;
      authService.user.name = e.name;
    });
  });
