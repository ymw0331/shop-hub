import express from "express";
import dotenv from "dotenv"; //environment variables
import mongoose from 'mongoose';
import morgan from "morgan"; //log request endpoints
import authRoutes from './routes/auth.js';
import categoryRoutes from "./routes/category.js";
import productRoutes from "./routes/product.js";
import cors from "cors";


dotenv.config();

const app = express();
mongoose.set( 'strictQuery', true );

//MongDB
mongoose.connect( process.env.MONGO_URI )
  .then( () => console.log( "MongoDB Connected" ) )
  .catch( ( err ) => console.log( "DB Error => ", err ) );


//Middleware
app.use( cors() );
app.use( morgan( "dev" ) );
app.use( express.json() );

//Router middleware
app.use( '/api', authRoutes );
app.use( '/api', categoryRoutes );
app.use( '/api', productRoutes );

const port = process.env.PORT || 8000;

app.listen( port, () =>
{
  console.log( `Node server is running on port ${ port }` );
} );

