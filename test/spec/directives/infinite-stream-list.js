'use strict';

describe('Directive: infiniteStreamList', function () {

  // load the directive's module
  beforeEach(module('peepoltvApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<infinite-stream-list></infinite-stream-list>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the infiniteStreamList directive');
  }));
});
