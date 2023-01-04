import Product from '../models/product.js';
import fs from "fs";


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
        res.json( { error: "Description is required" } );
      case !price.trim():
        res.json( { error: "Price is required" } );
      case !category.trim():
        res.json( { error: "Category is required" } );
      case !quantity.trim():
        res.json( { error: "Quantity is required" } );
      case !shipping.trim():
        res.json( { error: "Shipping is required" } );
      case photo && photo.size > 1000000:
        res.json( { error: "Image should be less than 1mb in size" } );
    }

    //create product 
    const product = new Product( { ...req.fields, slug} );

  } catch ( err )
  {
    console.log( err );
    return res.status( 400 ).json( err.message );
  }
};

