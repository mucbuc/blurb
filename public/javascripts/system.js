function System() {

  var elements = []
    , removals = [];

  function tick() {
    elements = elements.filter( function( element ) { 
      return removals.indexOf( element ) == -1;
    } ); 
    removals = [];
  };

  this.addElements = function() {
    for (var i = 0; i < arguments.length; ++i) {
      elements.push( arguments[i] );
    }
  };

  this.removeElements = function() {
    for (var i = 0; i < arguments.length; ++i) {
      removals.push( arguments[i] );
    }
  };

  this.forEach = function( f ) {
    tick();
    elements.forEach( f );
  };
  
  this.indexOf = function( e ) { 
    return elements.indexOf( e );
  };
  
  this.sort = function( c ) {
    tick();
    return elements.sort( c );
  };
  
  this.getLength = function() { 
    tick();
    return elements.length;
  };
};

System.prototype = new Array();