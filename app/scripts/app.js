'use strict';

angular.module('rhinobird', [
  'ui.router',
  'ui.bootstrap',
  'infinite-scroll',
  'pl-licode',
  'leaflet-directive',
  'angularMoment',
  'ngImgCrop',
  'rhinobird.models',
  'rhinobird.services',
  'rhinobird.directives',
  'rhinobird.providers',
  'rhinobird.filters',
  'rhinobird.controllers'
])
.config(function ($stateProvider, $urlRouterProvider, $locationProvider, $restmodProvider,
                  $sceDelegateProvider, streamViewerConfigProvider, CameraServiceProvider,
                  settings, mobileDetect, $httpProvider, HttpInterceptorProvider) {
  // Remove hashes and enables html push state history
  $locationProvider.html5Mode(true);
  var isMobile = mobileDetect();

  // Fix for missing trailing slash
  // NOTE: All route definitions must end with a Slash now
  $urlRouterProvider.rule(function($injector, $location) {
    var path = $location.path(),
    // Note: misnomer. This returns a query object, not a search string
    search = $location.search(),
    params;

    // check to see if the path already ends in '/'
    if (path[path.length - 1] === '/') {
      return;
    }

    // If there was no search string / query params, return with a `/`
    if (Object.keys(search).length === 0) {
      return path + '/';
    }

    // Otherwise build the search string and return a `/?` prefix
    params = [];
    angular.forEach(search, function(v, k){
      params.push(k + '=' + v);
    });
    return path + '/?' + params.join('&');
  });

  // Intercept requests
  $httpProvider.interceptors.push(HttpInterceptorProvider.$get);

  // Force some redirections
  $urlRouterProvider
    .otherwise('/');

  // Define the application routes
  $stateProvider

    /* Routes user ui-sref="" instead of href
    ROUTE                                     URL
    - main                                    /
    - explore                                 /explore
    - search.streams                          /search/streams
    - search.channels                         /search/channels
    - search.people                           /search/people
    - golive                                  /golive
    - profile.streams                         /profile/streams
    - profile.settings                        /profile/settings
    - profile.directvideo                     /profile/directvideo
    - terms                                   /terms
    - trademark                               /trademark
    - privacy                                 /privacy
    - about                                   /about
    - goodbye                                 /goodbye
    - stream({streamId: <streamId>})          /stream/:streamId
    - stream.comments                         /stream/:streamId/comments
    - stream.videos                           /stream/:streamId/videos
    - stream.user                             /stream/:streamId/user
    - user({userName: <username>})            /user/:userName
    - user.streams                            /user/:userName/streams
    - user.following                          /user/:userName/following
    - user.followers                          /user/:userName/followers
    - user.live                               /user/:userName/live
    - allchannels                             /allchannels
    - channel({channelName: <channelname>})   /:channelName
    - vjsession.live({                             /:channelName/:userName
          channelName: <channelname>,
          userName: <username>
        })
    - vjsession.archived({vjId}: <vjId>)               /vj/:vjId
    */

    // Main
    .state('main', {
      url: '/?signup',
      templateUrl: '/views/main.html',
      controller: 'MainCtrl'
    })

    .state('main.world', {
      templateUrl: '/views/world.html',
      controller: 'WorldCtrl as vm'
    })
    .state('main.exciting', {
      url: 'exciting/',
      templateUrl: '/views/timeline.html',
      controller: 'TimelineCtrl as vm',
    })

    .state('main.near', {
      url: 'near/',
      templateUrl: '/views/timeline.html',
      controller: 'TimelineCtrl as vm',
    })

    .state('main.timeline', {
      url: 'myrb/',
      templateUrl: '/views/timeline.html',
      controller: 'TimelineCtrl as vm'
    })
    //


    // Explore
    .state('main.explore', {
      url: 'explore/?lat&lng',
      views: {
        "rightaction": {
          templateUrl: '/views/snippets/rightaction.html',
          controller: 'ExploreCtrl'
        },
        "": {
          templateUrl: '/views/explore.html',
          controller: 'ExploreCtrl'
        }
      }
    })

    // Search
    .state('search', {
      url: '/search/',
      abstract: true,
      templateUrl: '/views/search-results.html',
      controller: 'SearchResultsCtrl'
    })
    .state('search.streams', {
      url: 'streams/?q',
      templateUrl: '/views/search-results-streams.html'
    })
    .state('search.channels', {
      url: 'channels/',
      templateUrl: '/views/search-results-channels.html'
    })
    .state('search.people', {
      url: 'people/',
      templateUrl: '/views/search-results-people.html'
    })

    // Golive
    .state('golive', {
      url: '/golive/',
      templateUrl: function() {
        return isMobile ? '/views/goliveform.html' : '/views/golive.html';
      },
      controller: 'GoliveCtrl',
      resolve: {
        isMobile: function() {
          return isMobile;
        },
        session: ['AuthService', function(AuthService) {
          return AuthService.getSession();
        }]
      }
    })

    // Profile
    .state('profile', {
      url: '/profile/',
      templateUrl: '/views/profile.html',
      controller: 'ProfileCtrl as vm',
      resolve: {
        session: ['AuthService', function(AuthService) {
          return AuthService.getSession();
        }]
      }
    })
    .state('profile.streams', {
      url: 'streams/',
      templateUrl: '/views/profile-streams.html'
    })
    .state('profile.settings', {
      url: 'settings/',
      templateUrl: '/views/profile-settings.html'
    })
    .state('profile.directvideo', {
      url: 'directvideo/',
      templateUrl: '/views/profile-directvideo.html'
    })

    // Streams
    .state('stream', {
      url: '/stream/:streamId/',
      templateUrl: '/views/stream.html',
      controller: 'StreamCtrl as vm',
      resolve: {
        stream: ['Stream', '$q', '$stateParams', function(Stream, $q, $stateParams) {
          var deferred = $q.defer();

          var stream = Stream.$find($stateParams.streamId).$then(function() {
            if (stream.status === 'created') {
              deferred.reject('not yet active');
            } else {
              deferred.resolve(stream);
            }
          }, function() {
            deferred.reject('error');
          });

          return deferred.promise;
        }]
      }
    })
    .state('stream.comments', {
      templateUrl: '/views/stream-comments.html'
    })
    .state('stream.videos', {
      templateUrl: '/views/stream-videos.html'
    })
    .state('stream.user', {
      templateUrl: '/views/stream-user.html'
    })

    // User
    .state('user', {
      url: '/user/{userName:[0-9a-zA-Z-_]+}/',
      templateUrl: '/views/user.html',
      controller: 'UserCtrl as vm',
      resolve: {
        user: ['$stateParams', 'User', function($stateParams, User){
          return User.$find($stateParams.userName).$promise;
        }]
      }
    })
    .state('user.streams', {
      templateUrl: '/views/user-streams.html'
    })
    .state('user.following', {
      templateUrl: '/views/user-following.html'
    })
    .state('user.followers', {
      templateUrl: '/views/user-followers.html'
    })
    .state('user.live', {
      templateUrl: '/views/user-live.html'
    })

    .state('password?reset_password_token&complete', {
      url: '/profile/edit/?reset_password_token&complete',
      templateUrl: '/views/main.html',
      controller: 'MainCtrl'
    })

    // Vj session
    .state('vjsession',{
      url: '/vj/:vjId/',
      templateUrl: '/views/vj-session.html',
      controller: 'VjSessionCtrl',
      resolve: {
        vj: ['Vj', '$q', '$stateParams', function(Vj, $q, $stateParams) {
          var deferred = $q.defer();

          var vj = Vj.$find($stateParams.vjId).$then(function() {
            if (vj.status === 'pending') {
              deferred.reject('not yet archived');
            } else {
              deferred.resolve(vj);
            }
          }, function() {
            deferred.reject('error');
          });

          return deferred.promise;
        }]
      }
    })
    .state('vjsession-live',{
      url: '/{channelName:[0-9a-zA-Z-_]+}/{userName:[0-9a-zA-Z-_]+}/',
      templateUrl: '/views/vj-session-live.html',
      controller: 'VjSessionLiveCtrl',
      resolve: {
        user: ['$q', '$stateParams', 'User', function($q, $stateParams, User){
          var deferred = $q.defer();

          User.$find($stateParams.userName).$then( function(user) {
            deferred.resolve(user);
          });

          return deferred.promise;
        }]
      }
    })

    // Terms
    .state('terms', {
      url: '/terms/',
      templateUrl: '/views/terms.html'
    })

    // Trademark
    .state('trademark', {
      url: '/trademark/',
      templateUrl: '/views/trademark.html'
    })

    // Privacy
    .state('privacy', {
      url: '/privacy/',
      templateUrl: '/views/privacy.html'
    })

    // About
    .state('about', {
      url: '/about/',
      templateUrl: '/views/about.html'
    })

    // Goodbye
    .state('goodbye', {
      url: '/goodbye/',
      templateUrl: '/views/goodbye.html'
    })

    // Popular Animals
    .state('popularanimals', {
      url: '/popularanimals/',
      controller: 'PopularAnimalsCtrl as vm',
      templateUrl: '/views/popular-animals.html'
    })

    // AllChannels
    .state('allchannels', {
      url: '/allchannels/',
      controller: 'AllChannelsCtrl as vm',
      templateUrl: '/views/allchannels.html'
    })

    // Channels
    .state('channel', {
      url: '/{channelName:[0-9a-zA-Z-_]+}/',
      templateUrl: '/views/channel.html',
      controller: 'ChannelCtrl',
      resolve: {
        channel: ['$stateParams', 'Channel', function($stateParams, Channel){
          return Channel.$find($stateParams.channelName).$promise;
        }]
      }
    });

    // Config restmod
  $restmodProvider.pushModelBase(function() {
    this.setUrlPrefix(settings.apiHost);
    this.on('before-request', function(req){
      req.withCredentials = true;
    });
  });

  // Config whitelist for amazon s3
  $sceDelegateProvider.resourceUrlWhitelist([
    'self',
    'https://s3.amazonaws.com/media-rhinobird.tv/**',
    'https://s3.amazonaws.com/media-staging-rhinobird.tv/**',
    'https://s3.amazonaws.com/media-peepol.tv/**'
  ]);

  // Set camera service settings
  var csp = CameraServiceProvider;
  csp.enableVideo(true);
  csp.enableAudio(true);

  // Licode
  //csp.setVideoConstrain('videoSize', [640, 360, 640, 480], 'licode');

  // Mandatory
  csp.setVideoConstrain('minAspectRatio', 1.7777777778, 'mandatory');
  csp.setVideoConstrain('minWidth', 320,                'mandatory');
  csp.setVideoConstrain('minHeight', 180,               'mandatory');
  csp.setVideoConstrain('maxWidth', 640,                'mandatory');
  csp.setVideoConstrain('maxHeight', 360,               'mandatory');

  // Optional
  csp.setVideoConstrain('minAspectRatio', 1.7777777778, 'optional');
  csp.setVideoConstrain('facingMode', 'environment',    'optional');

  // Set stream viewer size presets
  streamViewerConfigProvider.addPreset('mini', 'auto', 100);
  streamViewerConfigProvider.addPreset('large', '100%', 512);
  streamViewerConfigProvider.addPreset('auto', '100%', '100%');
  streamViewerConfigProvider.setDefaultPreset('large');
})
.run(function($state, $rootScope, AuthService, CameraService, mobileDetect, $location){
  var isMobile = mobileDetect();

  $rootScope.$on('$stateChangeError', function (event, to) {
    if (to.name === 'golive') {
      AuthService.askLogin().then(function() {
        $state.go('golive');
      });
    }

    //if we weren't trying to open an archiving stream
    if (to.name !== 'stream') {
      // Navigate to main page
      $state.go('main');
    }
  });

  // Create an app object in the root scope for general application variables
  var app = {
    isLoggedIn: false, // Set the logged in app status
    isMobile: isMobile
  };
  $rootScope.app = app;

  // Change the logged in status on session change
  $rootScope.$on('sessionChanged', function(event, session, logginStatus){
    app.isLoggedIn = logginStatus;
  });

  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
    if (isMobile && fromState.name === '' && toState.name === 'main') {
      $location.path('/golive');
    }
  });

  // On state success
  $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState) {
    // Add the current state to the app variable
    app.state = toState.name;

    // Stop the camera every time we leave the golive page
    if(fromState.name === 'golive' && CameraService.licodeStream.stream){
      CameraService.licodeStream.stream.stop();
    }

  });

  // Try to get a initialized session
  AuthService.getSession();

});
