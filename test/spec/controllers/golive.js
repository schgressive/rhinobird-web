'use strict';

describe('Controller: GoliveCtrl', function () {

  // load the controller's module
  beforeEach(module('peepoltvWebApp'));

  var GoliveCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    GoliveCtrl = $controller('GoliveCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
