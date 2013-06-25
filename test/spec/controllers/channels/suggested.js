'use strict';

describe('Controller: ChannelsSuggestedCtrl', function () {

  // load the controller's module
  beforeEach(module('webApp'));

  var ChannelsSuggestedCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ChannelsSuggestedCtrl = $controller('ChannelsSuggestedCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
