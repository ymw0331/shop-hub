import User from "../models/user";

export const register = async ( req, res ) =>
{
  // console.log( req.body );
  try
  {
    const user = await new User( req.body ).save();
    res.json( user );

  } catch ( err )
  {
    console.log( err );
  }
};