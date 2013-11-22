'use strict';

describe('Controller: ProfileSettingsCtrl', function () {

  // load the controller's module
  beforeEach(module('peepoltvApp'));

  var ProfileSettingsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ProfileSettingsCtrl = $controller('ProfileSettingsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
