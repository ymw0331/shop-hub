import User from "../models/user.js";


export const register = async ( req, res ) =>
{
  try
  {
    //1. destructure name, email, password from req.body.password
    


    const user = await new User( req.body ).save();
    res.json( user ); //send back user information

  } catch ( err )
  {
    console.log( err );
  }
};