import Product from '../models/product.js';

export const create = async ( req, res ) =>
{
  try
  {
    // console.log( req.fields );
    // console.log( req.files );

    const { name, description, price, category, quantity, shipping } =
      req.fields;

    const { photo } = req.files;

    //validations
    switch ( true )
    {
      case !name.trim():
        res.json( { error: "Name is required" } );
      case !description.trim():
        res.json( { error: "Name is required" } );
      case !price.trim():
        res.json( { error: "Name is required" } );
      case !category.trim():
        res.json( { error: "Name is required" } );
      case !quantity.trim():
        res.json( { error: "Name is required" } );
      case !name.trim():
        res.json( { error: "Name is required" } );
    }



  } catch ( err )
  {
    console.log( err );
    return res.status( 400 ).json( err.message );
  }
};

