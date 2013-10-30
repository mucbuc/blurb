/// usage sockethub
//var hub = sockethub.listen( server );

var socketio = require( 'socket.io' )
  , events = require( 'events' );

var socketHub = {

  listen: function listen( server ) {
    var io = socketio.listen( server ), 
      channel = new events.EventEmitter();

    io.sockets.on( 'connection', function( socket ) {

      channel.on( 'broadcast', function( event, data ) {
        socket.emit( event, data ); 
      } ); 

      socket.on( 'message', function( data ) { 
        channel.emit( 'message', data );
      } );

      socket.on( 'broadcast', function( event, data ) {
        channel.emit( 'broadcast', event, data ); 
      } );

      channel.emit( 'connection', socket ); 
    } );

    return channel; 
  }
};

module.exports = socketHub; 
