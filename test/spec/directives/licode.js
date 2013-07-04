'use strict';

ddescribe('Directive: stream', function () {
  beforeEach(module('licode'));

  var element;

  it('should add an id to the element', inject(function ($rootScope, $compile) {
    element = angular.element('<stream></stream>');
    element = $compile(element)($rootScope);

    expect(element.attr('id')).toBeDefined();
  }));

  // it('should ask for getUserMedia permissions', inject(function ($rootScope, $compile) {
  //   element = angular.element('<stream></stream>');
  //   element = $compile(element)($rootScope);

  //   expect(element.text()).toBe('this is the stream directive');
  // }));
});
