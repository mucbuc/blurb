function Goal( game ) {
  Disc.call( this, game, 100 ); 
  this.center = $V( [ game.canvas.width, game.canvas.height ] ).multiply( 1/2 );
  this.fillStyle = '#000000';
}; 

Goal.prototype = new Disc;