'use strict';

describe('Directive: videoCanvasProjector', function () {

  // load the directive's module
  beforeEach(module('peepoltvApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<video-canvas-projector></video-canvas-projector>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the videoCanvasProjector directive');
  }));
});
