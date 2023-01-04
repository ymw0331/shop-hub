import jwt from "jsonwebtoken";

export const requireSignin = ( req, res, next ) =>
{
  // console.log( "REQ HEADERS =>", req.headers );
  // next();
  try
  {
    const decoded = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    // console.log( "decoded =>", decoded );
    req.user = decoded;
    next();
  } catch ( err )
  {
    return res.status( 401 ).json( err );
  }
};

export const isAdmin = async ( req, res, next ) =>
{
  try
  {

  } catch ( err )
  {
    console.log( err );
  }
};