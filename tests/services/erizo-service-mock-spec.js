describe('erizo service mock', function() {

  beforeEach(module('pl-licode-mocks'));

  var Erizo, room, remoteRoom, stream;

  beforeEach(inject(function($injector) {
    Erizo = $injector.get('Erizo');
    room = Erizo.Room();
    stream = Erizo.Stream();
  }));

  it('should create a room', function() {
    expect(room).not.toBe(null);
  })

  it('should create a stream', function() {
    expect(stream).not.toBe(null);
  })

  it('should fire a room connected event when connecting', function() {
    var fired;

    room.addEventListener('room-connected', function(){
      fired = true;
    });

    room.connect();

    expect(fired).toBe(true);
  })

  it('should fire a room disconnected event when disconnected', function() {
    var fired;

    room.addEventListener('room-disconnected', function(){
      fired = true;
    });

    room.disconnect();

    expect(fired).toBe(true);
  })

  it('should add a stream to the local streams pool of the rrom', function() {
    room.publish(stream);

    expect(room.localStreams.length).toBeGreaterThan(0);
  })

  it('should add a stream to the remote streams pool of the remote room', function() {
    room.publish(stream);

    remoteRoom = Erizo.Room();
    remoteRoom.connect();

    remoteRoom.subscribe(stream);

    expect(remoteRoom.remoteStreams.length).toBeGreaterThan(0);
    expect(remoteRoom.localStreams.length).toBe(0);
  })

  it('should fire the stream added event', function() {
    var fired;

    room.addEventListener('stream-added', function(){
      fired = true;
    })

    room.publish(stream);

    expect(fired).toBe(true);
  })

  it('should fire the stream subscribed event', function() {
    var fired;
    room.publish(stream);

    remoteRoom = Erizo.Room();
    remoteRoom.connect();

    remoteRoom.addEventListener('stream-subscribed', function(){
      fired = true;
    })

    remoteRoom.subscribe(stream);

    expect(fired).toBe(true);
  })

  it('should fire the stream data event', function() {
    var fired, dataEvent;

    stream.addEventListener('stream-data', function(_dataEvent){
      fired = true;
      dataEvent = _dataEvent;
    })

    stream.sendData('test');

    expect(fired).toBe(true);
    expect(dataEvent.stream).toEqual(stream);
    expect(dataEvent.msg).toEqual('test');
  })

});
