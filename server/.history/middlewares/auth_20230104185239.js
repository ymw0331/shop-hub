import jwt from "jsonwebtoken";

export const requireSignin = ( req, res, next ) =>
{
  // console.log( "REQ HEADERS =>", req.headers );
  // next();

  try
  {

    jwt.sign()
  } catch ( err )
  {
    return res.status( 401 ).json( err );
  }
};