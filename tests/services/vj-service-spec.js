describe('vj service', function() {

  beforeEach(module('pl-licode'));
  beforeEach(module('pl-licode-mocks'));
  beforeEach(module('rhinobird.services'));
  beforeEach(module('rhinobird.controllers'));

  var VjService, VjSessionLiveCtrl, scope, $httpBackend;
  var channelNameResponse = 'channel test';
  var userResponse = {
    email: 'sirius@rhinobird.tv',
    name: 'Sirius Black',
    username: 'siriusblack'
  };
  var vjResponse = {
    id: "e491813b203a5cc841a65804cae88345",
    username: userResponse.username,
    channelName: channelNameResponse,
    status: "created",
    archivedUrl: null,
    picks: [
      {
        id: "9ee0b6f0e31dddbcd82d97fa19bfd072",
        stream: {
          id: 0
        },
        streamId: 0,
        active: false,
        fixedAudio: false
      },
      {
        id: "628db71f61cf4375ad2df5c1f73c26cd",
        stream: {
          id: 1
        },
        streamId: 1,
        active: false,
        fixedAudio: false
      },
      {
        id: "122d60b1396a4d16a9ee0a894ad3f8c0",
        stream: {
          id: 2
        },
        streamId: 2,
        active: false,
        fixedAudio: false
      },
      {
        id: "9588c7fce05e42f1803f3653e69714e8",
        stream: {
          id: 3
        },
        streamId: 3,
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

    var userMock = angular.copy(userResponse);
    var vjMock = angular.copy(vjResponse);
    var channelNameMock = angular.copy(channelNameResponse);

    $httpBackend.whenGET(/users\/siriusblack$/)
      .respond(200, userMock);

    $httpBackend.whenGET(/users\/siriusblack\/vjs\?channel_name=channel\+test/ )
      .respond(200, [vjMock]);

    $httpBackend.whenGET(/vjs\/.*\/picks/)
      .respond(200, vjMock.picks);

    $httpBackend.whenPOST('vjs')
      .respond(201, vjMock);

    $httpBackend.whenPUT(/vjs\/.*/)
      .respond(200, angular.extend(vjMock, { status: 'live' }));

    var dyn;
    $httpBackend.whenPUT(/picks\/.*/, function(d){
        dyn = d;
        return true;
      })
      .respond(200, dyn);

    $httpBackend.whenDELETE(/picks\/.*/)
      .respond(200);

    $httpBackend.whenPOST(/vjs\/.*\/picks/)
      .respond(200, vjMock.picks[1]);

    // Start broadcast
    VjService.startBroadcast(vjMock.picks, 1, null, channelNameMock, {lng: 5438579438759437, lat: 548357934875943});

    $httpBackend.flush();

    // Start listening
    var user = User.$find(userMock.username);
    var vjs = user.vjs.$search({'channel_name': channelNameMock});
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
    VjService.activatePickByStreamId(1);

    expect(scope.picks[1]).toBeTheOnlyPickIn(scope.picks, 'active');
    expect(scope.currentPick.active).toBe(true);
    expect(scope.currentPick.fixedAudio).toBe(false);

  });

  it('should fix audio to one pick', function() {
    VjService.activatePickByStreamId(1);
    VjService.fixAudioPickByStreamId(1);

    expect(scope.picks[1]).toBeTheOnlyPickIn(scope.picks, 'active');
    expect(scope.picks[1]).toBeTheOnlyPickIn(scope.picks, 'fixedAudio');

    expect(scope.currentPick.active).toBe(true);
    expect(scope.currentPick.fixedAudio).toBe(true);

    VjService.fixAudioPickByStreamId(2);
    expect(scope.currentPick.fixedAudio).toBe(false);
  });

  it('should handle audio from streams based on picks', function() {
    // Activate pick 1 then 2
    VjService.activatePickByStreamId(1);

    expect(scope.currentPick.stream.isMuted).toBe(false);

    expect(scope.picks[0].stream.isMuted).toBe(true);
    expect(scope.picks[1].stream.isMuted).toBe(false);
    expect(scope.picks[2].stream.isMuted).toBe(true);
    expect(scope.picks[3].stream.isMuted).toBe(true);

    VjService.activatePickByStreamId(2);

    expect(scope.picks[0].stream.isMuted).toBe(true);
    expect(scope.picks[1].stream.isMuted).toBe(true);
    expect(scope.picks[2].stream.isMuted).toBe(false);
    expect(scope.picks[3].stream.isMuted).toBe(true);

    // Fix audio pick 2 then 3
    VjService.fixAudioPickByStreamId(2);

    expect(scope.picks[0].stream.isMuted).toBe(true);
    expect(scope.picks[1].stream.isMuted).toBe(true);
    expect(scope.picks[2].stream.isMuted).toBe(false);
    expect(scope.picks[3].stream.isMuted).toBe(true);

    VjService.fixAudioPickByStreamId(3);

    expect(scope.picks[0].stream.isMuted).toBe(true);
    expect(scope.picks[1].stream.isMuted).toBe(true);
    expect(scope.picks[2].stream.isMuted).toBe(true);
    expect(scope.picks[3].stream.isMuted).toBe(false);

    // Activate pick 1 then 0 audio stays in 3
    VjService.activatePickByStreamId(1);

    expect(scope.picks[0].stream.isMuted).toBe(true);
    expect(scope.picks[1].stream.isMuted).toBe(true);
    expect(scope.picks[2].stream.isMuted).toBe(true);
    expect(scope.picks[3].stream.isMuted).toBe(false);

    VjService.activatePickByStreamId(0);

    expect(scope.picks[0].stream.isMuted).toBe(true);
    expect(scope.picks[1].stream.isMuted).toBe(true);
    expect(scope.picks[2].stream.isMuted).toBe(true);
    expect(scope.picks[3].stream.isMuted).toBe(false);

    // Unfix audio from 3 pick 0 should be unmuted
    VjService.unfixAudioPickByStreamId(3);

    expect(scope.picks[0].stream.isMuted).toBe(false);
    expect(scope.picks[1].stream.isMuted).toBe(true);
    expect(scope.picks[2].stream.isMuted).toBe(true);
    expect(scope.picks[3].stream.isMuted).toBe(true);
  });

  it('should change the fix audio to te other picks', function() {
    VjService.fixAudioPickByStreamId(2);

    expect(scope.picks[1]).toBeTheOnlyPickIn(scope.picks, 'active');
    expect(scope.picks[2]).toBeTheOnlyPickIn(scope.picks, 'fixedAudio');

  });

  it('should unfix fix audio to the pick', function() {
    VjService.fixAudioPickByStreamId(2);

    expect(scope.picks[2].fixedAudio).toBe(true);
    expect(scope.picks[2]).toBeTheOnlyPickIn(scope.picks, 'fixedAudio');

    VjService.unfixAudioPickByStreamId(2);

    expect(scope.picks[2].fixedAudio).toBe(false);

  });

  it('should remove the stream', function() {
    VjService.removePickByStreamId(2);

    expect(scope.picks.length).toBe(3);

  });

  it('should broadcast the active pick changed event with the pick id', function() {
    var msg, fired = false;
    VjService.socket.stream.addEventListener('stream-data', function(evt){
      fired = true;
      msg = evt.msg;
    });

    VjService.activatePickByStreamId(1);

    expect(fired).toBe(true);
    expect(msg.event).toBe('active-pick-changed');
    expect(msg.params.pickId).toBe(scope.picks[1].id);
  });

  it('should broadcast the active audio pick changed event with the pick id and fixed true', function() {
    var msg, fired = false;
    VjService.socket.stream.addEventListener('stream-data', function(evt){
      fired = true;
      msg = evt.msg;
    });

    VjService.fixAudioPickByStreamId(1);

    expect(fired).toBe(true);
    expect(msg.event).toBe('active-audio-pick-changed');
    expect(msg.params.pickId).toBe(scope.picks[1].id);
    expect(msg.params.fixedAudio).toBe(true);
  });

  it('should broadcast the active audio pick changed event with the pick id and fixed false', function() {
    var msg, fired = false;
    VjService.socket.stream.addEventListener('stream-data', function(evt){
      fired = true;
      msg = evt.msg;
    });

    VjService.unfixAudioPickByStreamId(1);

    expect(fired).toBe(true);
    expect(msg.event).toBe('active-audio-pick-changed');
    expect(msg.params.pickId).toBe(scope.picks[1].id);
    expect(msg.params.fixedAudio).toBe(false);
  });

  it('should broadcast the picks changed event with the pick id and remove action', function() {
    var msg, fired = false;
    VjService.socket.stream.addEventListener('stream-data', function(evt){
      fired = true;
      msg = evt.msg;
    });

    var pickIdToRemove = scope.picks[1].id;

    VjService.removePickByStreamId(1);

    expect(fired).toBe(true);
    expect(msg.event).toBe('picks-changed');
    expect(msg.params.pickId).toBe(pickIdToRemove);
    expect(msg.params.action).toBe('remove');
  });

});
