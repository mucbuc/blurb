#!/usr/bin/env node

var assert = require( 'assert' )
  , events = require( 'events' )
  , field = require( '../lib/field' );

assert( typeof field !== 'undefined' );

testBasic();

function testBasic() {
	var COUNT = 100
	  , e = new events.EventEmitter(); 
	
	e.setMaxListeners( COUNT ); 

	for (var i = 0; i < COUNT; ++i) {
		field.addCell( e );
		assert( field.countCells() == i + 1 );
	}

	process.on( 'exit', function() {
		assert( !field.countCells() );
		console.log( 'test passed' ); 
	});

	e.emit( 'disconnect' );
}
