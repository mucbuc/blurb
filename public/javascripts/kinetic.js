/*
objective: 	
	track object velocity (cancelMotion)
	determine object center at current game time (beginMotionUniform)
			

implementation: 
	velocity is determined using the current and previous event location and there timestamps
	if there is no previous location the velocity = 0

todo: 
	track acceleration

*/

function Kinetic( game ) {

  var velocity = Vec.Zero
    , center = Vec.Zero
    , sampleTime = 0
    , originTime = 0;
    
  this.center = center;

  this.beginMotionUniform = function( initVelocity, initCenter ) {
    
    if (initVelocity) { 
      velocity = initVelocity;
    }
    
    if (initCenter) { 
      center = initCenter;
    }
    
    originTime = game.time;

    this.centerAtTime = function( t ) {
      return center.add( velocity.multiply( t - originTime ) );
    };

    this.__defineGetter__( "center", function() {
      return this.centerAtTime( game.time );
    } );
    
    this.__defineSetter__( "center", function( c ) {
      this.cancelMotion(); 
      this.center = c;
    } );
  };

  this.cancelMotion = function() {
  
    center = this.center;
    velocity = Vec.Zero;
    sampleTime = game.time;

    this.centerAtTime = function() {
      return center;
    };

    this.__defineGetter__( "center", function() {
      return center;
    } );
    
    this.__defineSetter__( "center", function( c ) {
      velocity = c.subtract( center ).multiply( 1 / (game.time - sampleTime) );
      sampleTime = game.time;
      center = c;
    } );
  }; 

  this.__defineGetter__( 'velocity', function() {
    return velocity;
  } );

  this.isMoving = function() { 
    return velocity.x || velocity.y;
  };
  
  this.isSamplingVelocity = function() {
    return game.time - sampleTime < game.VELOCITY_SAMPLE_TOLERANCE;
  };
};