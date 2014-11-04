describe('vj service', function() {

  beforeEach(module('pl-licode'));
  beforeEach(module('pl-licode-mocks'));
  beforeEach(module('rhinobird.services'));
  beforeEach(module('rhinobird.controllers'));

  var VjService, VjSessionLiveCtrl, scope, $httpBackend;
  var channelName = 'channel test';
  var userResponse = {
    email: 'sirius@rhinobird.tv',
    name: 'Sirius Black',
    username: 'siriusblack'
  };
  var vjResponse = {
    id: "e491813b203a5cc841a65804cae88345",
    username: userResponse.username,
    channelName: channelName,
    status: "created",
    archivedUrl: null,
    picks: [
      {
        id: "9ee0b6f0e31dddbcd82d97fa19bfd072",
        stream: {
          id: 1
        },
        streamId: 1,
        active: false,
        fixedAudio: false
      },
      {
        id: "628db71f61cf4375ad2df5c1f73c26cd",
        stream: {
          id: 2
        },
        streamId: 2,
        active: false,
        fixedAudio: false
      },
      {
        id: "122d60b1396a4d16a9ee0a894ad3f8c0",
        stream: {
          id: 3
        },
        streamId: 3,
        active: false,
        fixedAudio: false
      },
      {
        id: "9588c7fce05e42f1803f3653e69714e8",
        stream: {
          id: 4
        },
        streamId: 4,
        active: false,
        fixedAudio: false
      }
    ]
  };

  beforeEach(inject(function($injector, $rootScope) {
    $httpBackend = $injector.get('$httpBackend');
    $controller = $injector.get('$controller');
    VjService = $injector.get('VjService');
    Vj = $injector.get('Vj');
    User = $injector.get('User');
    scope = $rootScope.$new();

    $httpBackend.whenGET(/users\/siriusblack$/)
      .respond(200, userResponse);

    $httpBackend.whenGET(/users\/siriusblack\/vjs\?channel_name=channel\+test/ )
      .respond(200, [vjResponse]);

    $httpBackend.whenGET(/vjs\/.*\/picks/)
      .respond(200, vjResponse.picks);

    $httpBackend.whenPOST('vjs')
      .respond(201, vjResponse);

    $httpBackend.whenPUT(/vjs\/.*/)
      .respond(200, angular.extend(vjResponse, { status: 'live' }));

    $httpBackend.whenPUT(/picks\/.*/)
      .respond(200, angular.extend(vjResponse.picks[1], { active: true, fixedAudio: true }));

    $httpBackend.whenDELETE(/picks\/.*/)
      .respond(200);

    $httpBackend.whenPOST(/vjs\/.*\/picks/)
      .respond(200, vjResponse.picks[1]);

    // Start broadcast
    VjService.startBroadcast(vjResponse.picks, 1, null, channelName, {lng: 5438579438759437, lat: 548357934875943});

    $httpBackend.flush();

    // Start listening
    var user = User.$find(userResponse.username);
    var vjs = user.vjs.$search({'channel_name': channelName});
    $httpBackend.flush();

    VjSessionLiveCtrl = $controller('VjSessionLiveCtrl', {
      $scope: scope,
      vj: vjs[0],
      user: user
    });

    $httpBackend.flush();

  }));

  it('should create a vj service socket', function() {

    expect(VjService.socket).not.toBe(null);

  });

  it('should have 4 picks', function() {

    expect(scope.picks.length).toBe(4);

  });

  it('should deactivate other picks when a pick is activated', function() {
    VjService.activatePickByStreamId(2);

    expect(scope.picks[1]).toBeTheOnlyPickIn(scope.picks, 'active');

  });

  it('should fix audio to one pick', function() {
    VjService.fixAudioPickByStreamId(2);

    expect(scope.picks[1]).toBeTheOnlyPickIn(scope.picks, 'active');
    expect(scope.picks[1]).toBeTheOnlyPickIn(scope.picks, 'fixedAudio');

  });

  it('should change the fix audio to te other picks', function() {
    VjService.fixAudioPickByStreamId(3);

    expect(scope.picks[1]).toBeTheOnlyPickIn(scope.picks, 'active');
    expect(scope.picks[2]).toBeTheOnlyPickIn(scope.picks, 'fixedAudio');

  });

  it('should unfix fix audio to the pick', function() {
    VjService.fixAudioPickByStreamId(3);

    expect(scope.picks[2].fixedAudio).toBe(true);
    expect(scope.picks[2]).toBeTheOnlyPickIn(scope.picks, 'fixedAudio');

    VjService.unfixAudioPickByStreamId(3);

    expect(scope.picks[2].fixedAudio).toBe(false);

  });

  it('should remove the stream', function() {
    VjService.removePickByStreamId(3);

    expect(scope.picks.length).toBe(3);

  });

});
