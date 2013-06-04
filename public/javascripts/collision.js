function Collision( a, b, t, p ) {
  console.log( 'new collision ' + t );
  
  var time = t
    , obj1 = a
    , obj2 = b
    , predicted = p;
  
  this.getTime = function() { 
    return time;
  }; 
  
  this.object1 = function() { 
    return obj1;
  };

  this.object2 = function() { 
    return obj2;
  };
  
  this.__defineGetter__( "predicted", function() {
    return predicted;
  } );
};