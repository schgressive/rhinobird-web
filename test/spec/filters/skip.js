'use strict';

describe('Filter: skip', function () {

  // load the filter's module
  beforeEach(module('rhinobird'));

  // initialize a new instance of the filter before each test
  var skip;
  beforeEach(inject(function ($filter) {
    skip = $filter('skip');
  }));

  it('should return the input prefixed with "skip filter:"', function () {
    var text = 'angularjs';
    expect(skip(text)).toBe('skip filter: ' + text);
  });

});
