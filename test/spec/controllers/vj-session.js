'use strict';

describe('Controller: VjSessionCtrl', function () {

  // load the controller's module
  beforeEach(module('rhinobird'));

  var VjSessionCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    VjSessionCtrl = $controller('VjSessionCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
