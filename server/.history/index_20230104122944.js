import express from "express";
import dotenv from "dotenv"; //environment variables
import mongoose from 'mongoose';

dotenv.config();

const app = express();

//db
mongoose.connect( 'mongodb://localhost:27017/ecommerce2023' )
  .then( () => console.log( "MongoDB Connected" ) )
  .catch( ( err ) => console.log( "DB Error => ", err ) );

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

