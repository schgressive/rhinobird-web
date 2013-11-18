'use strict';

angular.module('peepoltvApp', ['ngRoute', 'ngResource', 'ui.bootstrap', 'pl-licode', 'plRestmod'])
  .config(function ($routeProvider, $locationProvider, $restmodProvider, settings) {
    $locationProvider.html5Mode(true);
    $routeProvider

      // Main
      .when('/', {
        templateUrl: '/views/main.html',
        controller: 'MainCtrl',
        section: 'explore'
      })

      // Explore
      .when('/explore', {
        templateUrl: '/views/explore.html',
        controller: 'ExploreCtrl',
        section: 'explore'
      })

      // Search
      .when('/search', {
        templateUrl: '/views/search-results.html',
        controller: 'SearchResultsCtrl',
        section: 'search'
      })

      // Golive
      .when('/golive', {
        templateUrl: '/views/golive.html',
        controller: 'GoliveCtrl',
        section: 'golive'
      })

      // Streams
      .when('/streams/:streamId', {
        templateUrl: '/views/stream.html',
        controller: 'StreamCtrl'
      })

      // Profile
      .when('/profile', {
        templateUrl: '/views/profile.html',
        controller: 'ProfileCtrl'
      })

      // Channels
      .when('/:channelName', {
        templateUrl: '/views/channel.html',
        controller: 'ChannelCtrl'
      })

      .otherwise({
        redirectTo: '/'
      });

      // Config restmod
      $restmodProvider.pushModelBase(function() {
        this.setRestUrlOptions({ baseUrl: settings.apiHost });
      });
  })
  .run(function($location, $rootScope, AuthService){
    $rootScope.$on('$routeChangeSuccess', function(event, current){
      $rootScope.section = current.$$route.section || null;
    });

    $rootScope.$on('$routeChangeError', function (event, parameters) {
      // Navigate to main page
      $location.path('/');
    });

    // Create an app object in the root scope for general application variables
    var app = {
      isLoggedIn: false // Set the logged in app status
    };
    $rootScope.app = app;

    // Change the logged in status on session change
    $rootScope.$on('sessionChanged', function(event, session, logginStatus){
      app.isLoggedIn = logginStatus;
    });

    // Try to get a initialized session
    AuthService.getSession();

  });
