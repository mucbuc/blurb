#!/usr/bin/env node

var assert = require( 'assert' )
  , field = require( 'field' );

assert( typeof field !== 'undefined' );

process.on( 'exit', function() {
	console.log( 'test passed' ); 

});