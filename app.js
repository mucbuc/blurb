#!/usr/bin/env node

/**
 * Module dependencies.
 */

var assert = require( 'assert' )
  , express = require('express')
  , socketio = require( 'socket.io' )
  , routes = require('./routes')
  , rules = require('./routes/rules')
  , http = require('http')
  , path = require('path')
  , app = express()
  , field = require( './lib/field' );

assert( typeof field !== 'undefined' );

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, '')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index );
app.get('/rules', rules.index );

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var io = socketio.listen( server ); 
io.on( 'connection', function( socket ) {  
  
  field.addCell( socket );

  socket.on( 'broadcast', function( event, data ) {
    socket.broadcast.emit( event, data );
  }); 

} );