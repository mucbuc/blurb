/* 
objective: 
  -emitter access
  -render and simulate game elements 
  -dispatch touch events to elements
*/ 

function Game( elementName, emitter ) {

  var canvas = new Canvas( document.getElementById( elementName ) )
    , visuals = new System()
    , touchables = new System()
    , dynamics = new System()
    , time = 0;

  window.addEventListener( 'unload', function() {
    emitter.emit( 'disconnect' );
  } );
  requestAnimFrame( tick );

  this.ignoreMouse = function() {
    window.removeEventListener( 'mouseup', mouseUp );
    window.removeEventListener( 'touchend', mouseUp );
    window.removeEventListener( 'mousemove', mouseMove );
    window.removeEventListener( 'touchmove', mouseMove );
    window.removeEventListener( 'mousedown', mouseDown );
    window.removeEventListener( 'touchstart', mouseDown );
    
    console.log( 'ignoreMouse' );
  };

  this.noticeMouse = function() {
    window.addEventListener( 'mouseup', mouseUp );
    window.addEventListener( 'touchend', mouseUp );
    window.addEventListener( 'mousemove', mouseMove );
    window.addEventListener( 'touchmove', mouseMove );
    window.addEventListener( 'mousedown', mouseDown );
    window.addEventListener( 'touchstart', mouseDown );
    
    console.log( 'noticeMouse' );
  };

  this.__defineGetter__( 'visuals', function() { 
    return visuals;
  } );

  this.__defineGetter__( 'touchables', function() { 
    return touchables;
  } );

  this.__defineGetter__( 'dynamics', function() { 
    return dynamics;
  } );

  this.__defineGetter__( 'time', function() { 
    return time;
  } );

  this.__defineGetter__( 'emitter', function() {
    return emitter;
  } );

  this.__defineGetter__( 'canvas', function() {
    return canvas;
  } );

  function tick() {
    requestAnimFrame( tick );

    time = Number( new Date() );
    dynamics.forEach( function( d ) { d.tick(); } );

    canvas.clearCanvas();
    visuals.forEach( function( v ) { v.render( canvas ); } );
  };

  function mouseUp( e ) {
    var pos = canvas.positionOnCanvas( e );
    touchables.forEach( function( l ) { 
      l.mouseUp( pos ); 
    } );
  };

  function mouseMove( e ) {
    var pos = canvas.positionOnCanvas( e );
    touchables.forEach( function( l ) { 
      l.mouseMove( pos ); 
    } );
  };

  function mouseDown( e ) {
    var pos = canvas.positionOnCanvas( e );
    
    if (pos.e(1) < canvas.width && pos.e(2) < canvas.height) { 
      touchables.forEach( function( l ) { 
        l.mouseDown( pos ); 
      } );
    }
  };
};