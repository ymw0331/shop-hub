import express from "express";
import dotenv from "dotenv"; //environment variables
import mongoose from 'mongoose';

dotenv.config();
// console.log( process );

const app = express();

//db
mongoose.connect('mongodb://localhose:2')

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

