'use strict';

angular.module('peepoltvApp')
  .controller('ChannelsCtrl', ['$scope', 'Streams', function ($scope, Streams) {

    // Get the streams based on geolocation
    Streams.search({}, function(r){
        $scope.streams = _.map(r, function(s){
          s.properties['marker-size'] = 'medium';
          s.properties['marker-color'] = '#aa56ff';
          s.properties['marker-symbol'] = 'cinema';
          return s;
        });
    });
}]);

angular.module('tabControls', []).
	directive('tabs', function() {
	    return {
	      restrict: 'E',
	      transclude: true,
	      scope: {},
	      controller: function($scope, $element) {
	        var panes = $scope.panes = [];
	 
	        $scope.select = function(pane) {
	          angular.forEach(panes, function(pane) {
	            pane.selected = false;
	          });
	          pane.selected = true;
	        }
	 
	        this.addPane = function(pane) {
	          if (panes.length == 0) $scope.select(pane);
	          panes.push(pane);
	        }
	      },
	      template:
	        '<div class="tabbable">' +
	          '<ul class="nav nav-tabs">' +
	            '<li ng-repeat="pane in panes" ng-class="{active:pane.selected}">'+
	              '<a href="" ng-click="select(pane)">{{pane.title}}</a>' +
	            '</li>' +
	          '</ul>' +
	          '<div class="tab-content" ng-transclude></div>' +
	        '</div>',
	      replace: true
	    };
    }).
    directive('pane', function() {
	    return {
	      require: '^tabs',
	      restrict: 'E',
	      transclude: true,
	      scope: { title: '@' },
	      link: function(scope, element, attrs, tabsCtrl) {
	        tabsCtrl.addPane(scope);
	      },
	      template:
	        '<div class="tab-pane" ng-class="{active: selected}" ng-transclude>' +
	        '</div>',
	      replace: true
	    };
	})