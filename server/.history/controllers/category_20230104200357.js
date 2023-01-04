import Category from '../models/category.js';
import slugify from 'slugify';

export const create = async ( req, res ) =>
{
  try
  {
    const { name } = req.body;
    if(!name.trim())
    console.log( req.body );
  }
  catch ( err )
  {
    console.log( err );
    return res.status( 400 ).json( err );
  }
};