'use strict';

describe('Service: GoliveService', function () {

  // load the service's module
  beforeEach(module('rhinobird'));

  // instantiate service
  var GoliveService;
  beforeEach(inject(function (_GoliveService_) {
    GoliveService = _GoliveService_;
  }));

  it('should do something', function () {
    expect(!!GoliveService).toBe(true);
  });

});
