import { useState, useEffect } from 'react';
import Jumbotron from '../components/cards/Jumbotron';
import axios from 'axios';
import ProductCard from '../components/cards/ProductCard';
import { Checkbox, Radio } from 'antd';
import { prices } from '../prices';


export default function Shop ()
{
  const [ categories, setCategories ] = useState( [] );
  const [ products, setProducts ] = useState( [] );
  const [ checked, setChecked ] = useState( [] ); //categories

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

  const handleChecked = async ( value, id ) =>
  {
    console.log( value, id );
    let all = [ ...checked ];
    if ( value )
    {
      all.push( id ); //push id to array of checked
    }
    else
    {
      all = all.filter( ( c ) => c !== id ); //filter id that didnt match
    }
    setChecked( all );
  };

  return (

    <>
      <Jumbotron
        title="Hello World"
        subTitle='Welcome to React E-Commerce'
      />

      <pre>{ JSON.stringify( checked, null, 4 ) }</pre>

      <div className='container-fluid'>

        <div className='row'>
          <div className='col-md-3'>

            <h2 className='p-3 mt-2 mb-2 h4 bg-light text-center'>
              Filter by Categories</h2>
            <div className='row p-5'>
              { categories?.map( c =>
              ( <Checkbox
                key={ c._id }
                onChange={ e => handleChecked( e.target.checked, c._id ) }
              >
                { c.name }
              </Checkbox>
              ) ) }
            </div>

            <h2 className='p-3 mt-2 mb-2 h4 bg-light text-center'>
              Filter by Prices</h2>
            <div className='row p-5'>
              <Radio.Group>
                { prices?.map( p =>
                {

                } ) }
              </Radio.Group>
            
              ) ) }
            </div>

          </div>


          <div className='col-md-9'>

            <h2 className='p-3 mt-2 mb-2 h4 bg-light text-center'>{ products?.length } Products</h2>

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