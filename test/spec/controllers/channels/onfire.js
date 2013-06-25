'use strict';

describe('Controller: ChannelsOnfireCtrl', function () {

  // load the controller's module
  beforeEach(module('webApp'));

  var ChannelsOnfireCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ChannelsOnfireCtrl = $controller('ChannelsOnfireCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
