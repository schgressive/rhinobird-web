describe('channel factory', function() {


  beforeEach(module('pl-licode'));
  beforeEach(module('pl-licode-mocks'));

  var socket, channelSocket;
  var token = '5034023k40234k02';

  beforeEach(inject(function($injector) {
    channelSocket = $injector.get('channelSocket');
    socket = channelSocket(token);
    socket.connect();
  }));

  it('should create a stream', function() {
    expect(socket.stream).not.toBe(null);
  })

  it('broadcast an event correctly', function() {
    var test;
    socket.stream.addEventListener('stream-data', function(event){
      test = true
    });

    socket.broadcastEvent('event-test', 'message');

    expect(test).toBe(true);
  })
});
