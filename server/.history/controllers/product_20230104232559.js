import Product from '../models/product.js';

export const create = async ( req, res ) =>
{
  try
  {
    // console.log( req.fields );
    // console.log( req.files );

    const { name, description, price, category, quantity, shipping } =
      req.fields;

      Const 

  } catch ( err )
  {
    console.log( err );
    return res.status( 400 ).json( err.message );
  }
};

