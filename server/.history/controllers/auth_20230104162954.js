import User from "../models/user.js";


export const register = async ( req, res ) =>
{
  try
  {
    //1. destructure name, email, password from req.body
    const {name, email, password} = req.body

    //2. all fields validation
    if(!name.trim()){
      return res.json({error:"Name is required"})
    }
    //3. check if email is taken
    //4. hash the password
    //5. register user
    //6. send response


    const user = await new User( req.body ).save();
    res.json( user ); //send back user information

  } catch ( err )
  {
    console.log( err );
  }
};