#!/usr/bin/env node

var assert = require( 'assert' )
  , events = require( 'events' )
  , field = require( '../lib/field' );

assert( typeof field !== 'undefined' );


testBasic();

process.on( 'exit', function() {
	console.log( 'test passed' ); 
});



function testBasic() {
	var COUNT = 1000
	  , e = new events.EventEmitter();
	
	e.setMaxListeners( COUNT ); 

	for (var i = 0; i < COUNT; ++i) {
		field.addCell( e );
		assert( field.countCells() == i + 1 );
	}
}
