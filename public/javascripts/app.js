(function() {
  
  var game = 0
    , logic = 0;
  
  window.addEventListener( 'load', function() { 
    game = new Game( 'canvas', io.connect() );
    game.noticeMouse();
    
    logic = new Logic( game );
  } ); 

} )();