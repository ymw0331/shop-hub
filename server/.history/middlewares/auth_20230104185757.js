import jwt from "jsonwebtoken";

export const requireSignin = ( req, res, next ) =>
{
  // console.log( "REQ HEADERS =>", req.headers );
  // next();

  try
  {
    const decoded = jwt.verify( req.headers.authorization, process.env.JWT_SECRET );
  } catch ( err )
  {
    return res.status( 401 ).json( err );
  }
};