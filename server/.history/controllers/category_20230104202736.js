import Category from '../models/category.js';
import slugify from 'slugify';
import category from '../models/category.js';

export const create = async ( req, res ) =>
{
  try
  {
    const { name } = req.body;
    if ( !name.trim() )
    {
      return res.json( { error: "Name is required" } );
    }
    const existingCategory = await Category.findOne( { name } );
    if ( existingCategory )
    {
      return res.json( { error: "Category already exists" } );
    }

    const category = await new Category( { name, slug: slugify( name ) } ).save();
    res.json( category );
  }
  catch ( err )
  {
    console.log( err );
    return res.status( 400 ).json( err );
  }
};

export const update = async ( req, res ) =>
{
  try
  {
    const category = await Category.findByIdAndUpdate( req.params.categoryId , {});

  } catch ( err )
  {
    console.log( err );
    return res.status( 400 ).json( err );
  }
};

export const remove = async ( req, res ) =>
{
  try
  {

  } catch ( err )
  {
    console.log( err );
    return res.status( 400 ).json( err );
  }
};

export const list = async ( req, res ) =>
{
  try
  {

  } catch ( err )
  {
    console.log( err );
    return res.status( 400 ).json( err );
  }
};


export const read = async ( req, res ) =>
{
  try
  {
    const category = await Category.findOne( { slug: req.params.slug } );
    res.json( category );

  } catch ( err )
  {
    console.log( err );
    return res.status( 400 ).json( err );
  }
};