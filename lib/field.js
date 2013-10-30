var assert = require( 'assert' )
  , $V = require( 'mucbuc-jsbag/lib/vec' ).$V;

assert( $V );

function Field() {
  var cells = []
    , dim = 1;

  this.countCells = function() {
    var result = 0; 

    cells.forEach( function(row, row_index) {
      row.forEach( function( column, column_index ) {
        ++result;
        if (    row_index == cells.length - 1
            &&  column_index == cells[row_index].length - 1) {
          return result;
        }  
      });
    } );
    return result;
  }; 

  this.addCell = function( socket ) {

    var pos = findEmpty(); 

    if (!cells[pos.x]) {
      cells[pos.x] = [];
    }
    cells[ pos.x ][ pos.y ] = socket;

    socket.on( 'disconnect', function() {
      delete cells[ pos.x ][ pos.y ];
    } );

    socket.on( 'transfer', transfer );

    function wrap( iv, mod ) {
      var m = $V( [ iv.x % mod, iv.y % mod ] )
        , x = m.x >= 0 ? m.x : m.x + mod
        , y = m.y >= 0 ? m.y : m.y + mod;

      return $V( x, y ); 
    }

    function floor( v ) { 
      return $V( [ Math.floor( v.x ), Math.floor( v.y ) ] );
    } 

    function getDirection( pos ) { 
      if (pos.x >= 1000) return $V( [ 1, 0 ] ); 
      if (pos.x <= 0) return $V( [ -1, 0 ] );
      if (pos.y >= 1000) return $V( [ 0, 1 ] );
      return $V( [ 0, -1 ] );
    }

    function transfer( data ) {
      
      var dest_index = $V( [ pos.x, pos.y ] )
        , direction = getDirection( data.position ); 
        
      do {
        dest_index = wrap( dest_index.add( direction ), dim );
      } 
      while (isEmpty(dest_index));
      
      direction = direction.scale( 1000 ); 
      
      data.position = { x: data.position.x - direction.x, y: data.position.y - direction.y };
      cells[ dest_index.x ][ dest_index.y ].emit( 'transfer', data );
    
      function isEmpty( i ) {
        if (!cells[ i.x ]) {
          cells[ i.x ] = [];
          return true;
        }
        return !cells[ i.x ][ i.y ];
      }
    }

    function findEmpty() {
      var result = dim;
      for (var i = 0; i < dim; ++i) {
        for (var j = 0; j < dim; ++j) {
          if (!cells[i]) {
            cells[i] = [];
            return { x: i, y: j };
          }
          else if (!cells[i][j]) {
            return { x: i, y: j };
          }
        }
      }
      
      ++dim;
      cells[dim] = [];
     
      return { x: result, y: 0 };
    }
  };
};

module.exports = new Field();