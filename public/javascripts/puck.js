/*
objective: 
	kinetic collision response
	handle drag 
	load context 
	blow up
*/ 

function Puck( game, center ) {
    
  var offset = Vec.Zero;
    
  Disc.call( this, game );
  
  this.fillStyle = game.DEFAULT_FILL_STYLE;
  
  this.collidePuck = function( puck ) {
    var va = this.velocity
      , vb = puck.velocity
      , n = this.center.subtract( puck.center )
      , p = 0;

    n = n.multiply( 1 / n.modulus() );
    p = va.dot( n ) - vb.dot( n );
    n = n.multiply( p );

    this.cancelMotion();
    this.beginMotionUniform( va.subtract( n ) );
	this.touchTime = game.time;
	
    puck.cancelMotion();
    puck.beginMotionUniform( vb.add( n ) );
    puck.touchTime = game.time;
  };

  this.collideGoal = function( goal ) {
    var va = this.velocity
      , vb = va.multiply( -1 )
      , n = this.center.subtract( goal.center )
      , p = 0;

    n = n.multiply( 1 / n.modulus() );
    p = va.dot( n ) - vb.dot( n );
    n = n.multiply( p );
    
    this.cancelMotion();
    this.beginMotionUniform( va.subtract( n ) );
    this.touchTime = game.time;
  };

  this.initDrag = function( pos ) {

    game.touchables.addElements( this );

    this.cancelMotion();
    offset = this.center.subtract( pos );
    
    this.touchTime = game.time;
  };

  this.mouseMove = function( pos ) {
    this.center = pos.add( offset );
  };

  this.mouseUp = function() {
    game.touchables.removeElements( this );
    
    if (this.isMoving() && this.isSamplingVelocity()) {
      this.beginMotionUniform();
    }
    else {
      this.cancelMotion();
    }
    game.predictCollisions( this );
  };

  this.mouseDown = function() { 
  }; 

  this.isUnder = function( pos ) {
    var diff = pos.subtract( this.center );
    if (diff && diff.modulus() < this.radius) {
      return true;
    }
    return false;
  };

  this.initBlowup = function() {
    var beginTime = game.time
      , beginRadius = this.radius
      , puck = this
      , pump = {
          tick: function() { 
            puck.radius = beginRadius + (game.time - beginTime) * game.RADIUS_GROWTH_FACTOR;
          }, 
          mouseUp: function() {
            game.dynamics.removeElements( pump );
          }, 
          mouseDown: function() {}, 
          mouseMove: function() {},
        };

    game.dynamics.addElements( pump );
    game.touchables.addElements( pump );
  }
  
  this.loadContext = function( data ) { 
    var v = $V( [ data.velocity.x, data.velocity.y ] )
      , b = $V( [ data.position.x, data.position.y ] );
    this.radius = data.radius;
    this.fillStyle = data.fillStyle;
    this.beginMotionUniform( v, b ); 
  };
};

Puck.prototype = new Disc;