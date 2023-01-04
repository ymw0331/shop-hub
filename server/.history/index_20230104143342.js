import express from "express";
import dotenv from "dotenv"; //environment variables
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import router from './routes/auth.js';
// console.log( process );

dotenv.config();

const app = express();

//MongDB
mongoose.connect( process.env.MONGO_URI )
  .then( () => console.log( "MongoDB Connected" ) )
  .catch( ( err ) => console.log( "DB Error => ", err ) );

//router middleware
app.use( authRoutes );

const port = process.env.PORT || 8000;

app.listen( port, () =>
{
  console.log( `Node server is running on port ${ port }` );
} );

