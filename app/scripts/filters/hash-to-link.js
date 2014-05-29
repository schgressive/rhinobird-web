'use strict';

angular.module('rhinobird.filters')
  .filter('hashToLink', function($sce) {

    var regexp = new RegExp('#([^\\s|^#]+)','g'); // Hashtag regex

    return function(input){

      if(!input) { return input; }
      return $sce.trustAsHtml(input.replace(regexp, '<a class="caption-hash" href="/$1">#$1</a>'));

    };
  });
