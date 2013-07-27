/* 
objective: 
	determine object shape and size
	render object 	
*/ 


function Disc( game, r ) {
  
  var radius = r == undefined ? game.DEFAULT_DISC_SIZE : r;
  
  if (game != undefined) {
    Kinetic.call( this, game );
    game.visuals.addElements( this );
  }

  this.render = function( canvas ) {
    var context = canvas.getContext();

    context.beginPath();
    context.arc( this.center.x, this.center.y, this.radius, 0, 2 * Math.PI );
    context.closePath();
    context.fillStyle = this.fillStyle;
    context.fill();
  };
  
  this.__defineGetter__( 'radius', function() {
    return radius;
  } ); 
  
  this.__defineSetter__( 'radius', function( r ) {
    radius = r;
  } );
  
};

Disc.prototype = new Kinetic;

function relativeDistanceDiscDisc( q, p ) { 
  var bd = q.center.sub( p.center )
    , vd = q.velocity.sub( p.velocity ) 
    , dot = bd.dot( vd )
    , t = -dot / vd.dot(vd)
    , d = bd.dot(bd) + t * dot
    , r1 = q.radius
    , r2 = p.radius;
  if (Math.sqrt(d) <= r1 + r2) {
    var vdot = vd.dot(vd)
      , bdot = bd.dot(bd)
      , s = bdot - (r1 + r2) * (r1 + r2); 
    t = -(dot + Math.sqrt( dot * dot - vd.dot(vd) * s )) / vdot; 
    return t;
  }
  return Number.Nan;
};
