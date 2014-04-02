'use strict';

describe('Controller: DefaultActionsCtrl', function () {

  // load the controller's module
  beforeEach(module('rhinobird'));

  var DefaultActionsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DefaultActionsCtrl = $controller('DefaultActionsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
