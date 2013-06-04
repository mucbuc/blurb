function Logic( game ) { 

  var pucks = new System()
    , collisions = new System()
    , goal = new Goal( game )
    , boundaries = []
    , points = 0;

  game.VELOCITY_SAMPLE_TOLERANCE = 1000 / 20;
  game.DEFAULT_DISC_SIZE = 5;
  game.RADIUS_GROWTH_FACTOR = 1 / 10;
  game.DEFAULT_FILL_STYLE = '#eee';

  game.dynamics.addElements( this );
  game.visuals.addElements( this );
  game.touchables.addElements( this );
  game.predictCollisions = predictCollisions;
    
  goal.fillStyle = getRandomColor();
  game.emitter.on( 'pirate', function( data ) { 
    if (data.fillStyle === goal.fillStyle) {
      points += data.points + 1;
      updateScore( points );
    }
  } ); 

  game.emitter.on( 'transfer', function( data ) { 
    var puck = makePuck();
    puck.loadContext( data );
    predictCollisions( puck );
    checkCollisionsBoundaries( puck );
  } );

  boundaries.push( new Boundary( game, 'left' ) );
  boundaries.push( new Boundary( game, 'right' ) );
  boundaries.push( new Boundary( game, 'top' ) );
  boundaries.push( new Boundary( game, 'bottom' ) );

  this.tick = function() {

    var invalid = new System()
      , rogues = new System()
      , counter = 0;

    function lessTime( a, b ) { 
      if (a.getTime() <= b.getTime()) { 
        return -1;
      } 
      else { 
        return 1;
      }
    }; 

    function handleGoalCollision( puck ) {
      puck.collideGoal( goal );
      if (puck.fillStyle === game.DEFAULT_FILL_STYLE) {
        puck.fillStyle = goal.fillStyle;
      }
      else {
        if (puck.fillStyle === goal.fillStyle) {
          gameOver();
        }
        else {
          var data = { points: points, fillStyle: puck.fillStyle };
          game.emitter.emit( 'broadcast', 'pirate', data );
          gameOver();
        };
      }
    }; 

    // TODO: check for multiple objects colliding at same time
    collisions.sort( lessTime );

    collisions.forEach( function( collision ) {
      var obj1 = collision.object1()
        , obj2 = collision.object2();

      if (   invalid.indexOf(obj1) != -1
          || invalid.indexOf(obj2) != -1) {
        collisions.removeElements( collision );
      }
      else if (	(	obj1.touchTime
      			&&  obj1.touchTime > collision.predicted )
      		 ||	( 	obj2.touchTime 
      		  	&& 	obj2.touchTime > collision.predicted) )
      { 
        collisions.removeElements( collision );
      }
      else if (collision.getTime() <= game.time) {
        
        if (obj1 === goal) {
          handleGoalCollision( obj2 );
          rogues.addElements( obj2 );
          delete obj2.transfer; 
        }
        else if (obj2 === goal) {
          handleGoalCollision( obj1 );
          rogues.addElements( obj1 );
          delete obj1.transfer;
        }
        else {
          obj1.collidePuck( obj2 );
          rogues.addElements( obj1, obj2 );
          delete obj1.transfer;
          delete obj2.transfer;
        }
        
        collisions.removeElements( collision );
      }

      invalid.addElements( obj1, obj2 );
    } );

    rogues.forEach( function( rogue ) {
      predictCollisions( rogue );
      checkCollisionsBoundaries( rogue );
    } );
    
    pucks.forEach( function( puck ) { 
      if (puck.transfer && puck.transfer < game.time) {
        var p = puck.centerAtTime( puck.transfer )
          , v = puck.velocity;
        
        game.emitter.emit( 'transfer', { 
          position: { x: p.e(1), y: p.e(2) },
          velocity: { x: v.e(1), y: v.e(2) }, 
          radius: puck.radius,
          fillStyle: puck.fillStyle
        } );
         
        removePuck( puck );
      }
    } );

    delete rogues;
    delete invalid;
  };

  this.render = function() { 
  };

  this.mouseUp = function( pos ) {
  };

  this.mouseMove = function( pos ) {
  };

  this.mouseDown = function( pos ) {
    
    var counter = pucks.getLength()
    
    function addPuck( pos ) {
      var puck = makePuck();
      puck.center = pos;
      puck.initBlowup();
      puck.initDrag( pos );
      puck.fillStyle = game.DEFAULT_FILL_STYLE;
    };
    
    if (counter) {
      
      function decCounter() {
        if (!--counter) {
          addPuck( pos );
        } 
      };
      
      pucks.forEach( function( e ) {
        if (!e.isUnder( pos )) {
          decCounter();
        }
        else {
          e.initDrag( pos );
          delete e.transfer;
        }
      } );
    }
    else {
      addPuck( pos );
    }
  };

  // borrowed from: http://stackoverflow.com/questions/1484506/random-color-generator-in-javascript
  function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('')
      , color = '#';
    
    for (var i = 0; i < 6; i++ ) {
      color += letters[ Math.round( Math.random() * 15 ) ];
    }
    return color;
  }

  function makePuck() {
    var puck = new Puck( game );
    pucks.addElements( puck );
    return puck;
  }
  
  function removePuck( p ) {
    pucks.removeElements( p );
    game.touchables.removeElements( p );
    game.dynamics.removeElements( p );
    game.visuals.removeElements( p );
  }; 

  function updateScore( value ) {
    var score = document.getElementById( 'score' );
    score.innerHTML = "score: " + value;
  }

  function predictCollisions( rogue ) {
    pucks.forEach( function( puck ) {

      if (rogue !== puck) {
        var t = relativeDistanceDiscDisc( rogue, puck );
        if (t > 0) {
          collisions.addElements( new Collision( rogue, puck, t + game.time, game.time ) );
        }
      }
      var t = relativeDistanceDiscDisc( goal, puck );
      if (t > 0) {
        collisions.addElements( new Collision( goal, puck, t + game.time, game.time ) );
      }
      
      checkCollisionsBoundaries( rogue );
    } );
  };

  function checkCollisionsBoundaries( puck ) {
    boundaries.forEach( function( boundary ) {
      var b = boundary.getRelativeDistance( puck );
      if (b > 0) {
        b += game.time; 
        if (!puck.transfer || puck.transfer > b) { 
          puck.transfer = b;
        }
      }
    } );
  };

  function gameOver() {
  /*  window.alert( "game over" );
    window.location.reload();
  */
   goal.fillStyle = getRandomColor();
   updateScore( 0 );
  };

}; 