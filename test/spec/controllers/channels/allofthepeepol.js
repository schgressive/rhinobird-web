'use strict';

describe('Controller: ChannelsAllofthepeopleCtrl', function () {

  // load the controller's module
  beforeEach(module('webApp'));

  var ChannelsAllofthepeopleCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ChannelsAllofthepeopleCtrl = $controller('ChannelsAllofthepeopleCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
