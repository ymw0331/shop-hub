import { useState, useEffect } from 'react';
import Jumbotron from '../components/cards/Jumbotron';
import axios from 'axios';
import ProductCard from '../components/cards/ProductCard';


export default function Shop ()
{
  const [ categories, setCategories ] = useState( [] );
  const [ products, setProducts ] = useState( [] );

  useEffect( () =>
  {
    loadProducts();
  }, [] );

  const loadProducts = async () =>
  {
    try
    {
      const { data } = await axios.get( "/products" );
      setProducts( data );
    } catch ( error )
    {
      console.log( error );
    }
  };

  useEffect( () =>
  {
    loadCategories();
  }, [] );

  const loadCategories = async () =>
  {
    try
    {
      const { data } = await axios.get( "/categories" );
      setCategories( data );
    } catch ( error )
    {
      console.log( error );
    }
  };

  return (

    <>
      <Jumbotron
        title="Hello World"
        subTitle='Welcome to React E-Commerce'
      />

      <div className='container-fluid'>

        <div className='row'>
          <div className='col-md-3'>


          </div>


          <div className='col-md-9'>

            <h2 className='text-center'>{ products?.length } Products</h2>

            <div className='row'>

              { products?.map( p =>

              ( <div className='col-md-4' key={ p._id }>
                <ProductCard p={ p } />
              </div> ) ) }

            </div>
          </div>
        </div>

      </div>
    </>
  );
}