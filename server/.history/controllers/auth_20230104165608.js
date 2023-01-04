import User from "../models/user.js";
import { hashPassword, comparePassword } from '../helpers/auth.js';


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
    const existingUser = await User.findOne( { email: email } );
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

    //6. send response
    res.json(user)



  } catch ( err )
  {
    console.log( err );
  }
};