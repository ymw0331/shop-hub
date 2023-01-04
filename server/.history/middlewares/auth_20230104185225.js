import jwt from "jsonwebtoken";

export const requireSignin = ( req, res, next ) =>
{
  // console.log( "REQ HEADERS =>", req.headers );
  // next();

  try
  {

  } catch ( err )
  {
    return res.status( 401 )
  }
};