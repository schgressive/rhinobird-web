'use strict';

describe('Controller: ChannelsLocalCtrl', function () {

  // load the controller's module
  beforeEach(module('webApp'));

  var ChannelsLocalCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ChannelsLocalCtrl = $controller('ChannelsLocalCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
