import express from "express";

const app = express();

app.get( "/users", ( req, res ) =>
{
  res.json( {
    data: "Wayne Yong Kevin Sara",
  } );

} );


const port = process.env.PORT || 

app.listen( 8000, () =>
{
  console.log( "Node server is running on port 8000" );
} );

