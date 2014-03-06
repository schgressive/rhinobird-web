'use strict';

angular.module('peepoltv.directives')
  .directive('hashToLink', function($interpolate) {
    return {
      restrict: 'EA',
      replace:true,
      link:function(scope, elm, attrs){
        var regexp = new RegExp('#([^\\s|^#]+)','g'); // Hashtag regex

        var tmp =  $interpolate(elm.text())(scope);
        tmp = tmp.replace(regexp, '<a href="/$1">#$1</a>');

        elm.html(tmp);
      }
    };
  });
