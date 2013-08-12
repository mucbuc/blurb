
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , rules = require('./routes/rules')
  , http = require('http')
  , path = require('path')
  , app = express()
  , field = require( 'field' )
  , socketHub = require( 'sockethub' );

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

var channel = socketHub.listen( server ); 
channel.on( 'connection', function( socket ) {  
  console.log( 'connection' );
  field.addCell( socket );
} );
