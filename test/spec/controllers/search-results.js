'use strict';

describe('Controller: SearchResultsCtrl', function () {

  // load the controller's module
  beforeEach(module('peepoltvWebApp'));

  var SearchResultsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SearchResultsCtrl = $controller('SearchResultsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
