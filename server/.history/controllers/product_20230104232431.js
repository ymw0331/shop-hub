import Product from '../models/product.js';

export const create = async ( req, res ) =>
{
  try
  {
    console.log( req.fields );
  } catch ( err )
  {
    console.log( err );
    return res.status( 400 ).json( err.message );
  }
};

