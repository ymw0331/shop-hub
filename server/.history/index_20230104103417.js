import express from "express";

console.log( "process => " );
const app = express();

app.get( "/users", ( req, res ) =>
{
  res.json( {
    data: "Wayne Yong Kevin Sara",
  } );

} );


app.listen( 8000, () =>
{
  console.log( "Node server is running on port 8000" );
} );

