#!/usr/bin/env node

var events = require( 'events' )
  , field = require( '../lib/field' )
  , test = require( 'tape' );

test( 'testBasic', (t) => {

	var COUNT = 100
	  , e = new events.EventEmitter(); 
	
	e.setMaxListeners( COUNT ); 

	for (var i = 0; i < COUNT; ++i) {
		field.addCell( e );
		t.equal( field.countCells(), i + 1 );
	}
	e.emit( 'disconnect' );

	t.equal( field.countCells(), 0 );
	t.end();
});
