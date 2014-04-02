'use strict';

describe('Controller: MockChannelCtrl', function () {

  // load the controller's module
  beforeEach(module('rhinobird'));

  var MockChannelCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MockChannelCtrl = $controller('MockChannelCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
