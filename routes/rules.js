
/*
 * GET users listing.
 */

exports.index = function(req, res){
  res.render( 'rules',  { title: 'Blurb rules' } );
};