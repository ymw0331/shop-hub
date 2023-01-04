import express from "express";

const app = express();

app.get( "/users", ( req, res ) =>
{
  res.json( {
    data: "Wayne Yong Kevin Sara",
  } );

} );


const port = process.env.PORT || 8000;

app.listen( port, () =>
{
  console.log( `Node server is running on port ${ port }` );
} );

