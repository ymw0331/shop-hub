import User from "../models/user.js";
import { hashPassword, comparePassword } from '../helpers/auth.js';
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const register = async ( req, res ) =>
{
  try
  {
    //1. destructure name, email, password from req.body
    const { name, email, password } = req.body;

    //2. all fields validation
    if ( !name.trim() )
    {
      return res.json( { error: "Name is required" } );
    }
    if ( !email )
    {
      return res.json( { error: "Email is taken" } );
    }
    if ( !password || password.length < 6 )
    {
      return res.json( { error: "Password must be at least 6 characters long" } );
    }

    //3. check if email is taken
    const existingUser = await User.findOne( { email } );
    if ( existingUser )
    {
      return res.json( { error: "Email is taken" } );
    }

    //4. hash the password
    const hashedPassword = await hashPassword( password );

    //5. register user (use destructuring instead of request body)
    const user = await new User( {
      name,
      email,
      password: hashedPassword
    } ).save();

    //6. create signed jwt
    const token = jwt.sign( { _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d' //token to be valid for 7 days
    } );

    //7. send response
    res.json( {
      user: {
        //no password in response
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.address
      },
      token
    }
    );
  } catch ( err )
  {
    console.log( err );
  }
};


export const login = async ( req, res ) =>
{
  try
  {
    //1. destructure name, email, password from req.body
    const { email, password } = req.body;

    //2. all fields validation

    if ( !email )
    {
      return res.json( { error: "Email is taken" } );
    }
    if ( !password || password.length < 6 )
    {
      return res.json( { error: "Password must be at least 6 characters long" } );
    }

    //3. check if email is taken
    const user = await User.findOne( { email } );
    if ( !user )
    {
      return res.json( { error: "User not found" } );
    }

    //4. compare password
    const match = await comparePassword( password, user.password );

    if(!match ){
      
    }

    //6. create signed jwt
    const token = jwt.sign( { _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d' //token to be valid for 7 days
    } );

    //7. send response
    res.json( {
      user: {
        //no password in response
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.address
      },
      token
    }
    );
  } catch ( err )
  {
    console.log( err );
  }
};

