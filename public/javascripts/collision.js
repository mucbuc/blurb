function Collision( a, b, t ) {
  console.log( 'new collision ' + t );
  
  var time = t
    , obj1 = a
    , obj2 = b;
  
  this.getTime = function() { 
    return time;
  }; 
  
  this.object1 = function() { 
    return obj1;
  };

  this.object2 = function() { 
    return obj2;
  };
};