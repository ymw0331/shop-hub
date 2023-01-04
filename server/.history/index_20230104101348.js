const express = require( "express" );

const app = express();

app.get( "/users", function ( req, res )
{
  //handle the response
  res.json( {
    data: "Wayne Yong",
  } );

} );

app.listen( 8000, function (
  consolelog( "Node server is running on port 8000" )
) );