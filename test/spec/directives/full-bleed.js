'use strict';

describe('Directive: resize', function () {
  beforeEach(module('rhinobird'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<resize></resize>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the resize directive');
  }));
});
