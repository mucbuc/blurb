function Goal( game ) {
  Disc.call( this, game, 100 ); 
  this.center = window.$V( [ game.canvas.width, game.canvas.height ] ).scale( 1/2 );
  this.fillStyle = '#000000';
}; 

Goal.prototype = new Disc;