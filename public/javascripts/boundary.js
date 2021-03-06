function Boundary( game, edge ) {

  var anchor = $V( [0, 0] )
    , normal = $V( [1, 0] );
  
  function init() {
    var GAP = 10; 
    switch (edge)
    {
      case 'left': 
        anchor = $V( [-GAP, 0] );
        normal = $V( [1, 0] );
  	    break;
  	  case 'top':
  	    anchor = $V( [0, -GAP] );
  	    normal = $V( [0, 1] );
  	    break;
  	  case 'right':
  	    anchor = $V( [ game.canvas.width + GAP, 0] );
  	    normal = $V( [-1, 0] );
  	    break;
      case 'bottom':
        anchor = $V( [0, game.canvas.height + GAP] );
  	    normal = $V( [0, -1] ); 
  	    break;
     };
  }; 
  init();
  
  this.getRelativeDistance = function( puck ) {
    var diff = anchor.sub( puck.center )
      , relVelocity = puck.velocity.dot( normal )
      , relDist = diff.dot( normal )
    return relDist / relVelocity;
  };

  this.render = function( canvas ) {
    var context = canvas.context
      , dir = normal.scale( 100 )
      , point = anchor.add( dir );
    
    context.beginPath();
    context.strokeStyle = '#FF0000';
    context.lineWidth = 10;
    context.moveTo( anchor.x, anchor.y );
    context.lineTo( point.x, point.y ); 
    context.stroke();
  };
};