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
  const [ radio, setRadio ] = useState( [] ); //for price array to be selected

  //when no filter chosen
  useEffect( () =>
  {
    if ( !checked.length || !radio.length ) loadProducts();
  }, [ checked, radio ] );

  //when filter chosen
  useEffect( () =>
  {
    if ( checked.length || radio.length ) loadFilteredProducts();

  }, [ checked, radio ] ); //only execute when values of checked and radio change


  const loadFilteredProducts = async () =>
  {
    try
    {
      const { data } = await axios.post( "/filtered-products", {
        checked, radio
      } );
      console.log( "filtered products => ", data );
      setProducts( data );

    } catch ( error )
    {
      console.log( error );
    }
  };



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

  const loadCategories = async ( e ) =>
  {
    try
    {
      const { data } = await axios.get( "/categories" );
      setCategories( data.sort( function ( a, b )
      {
        a = a.name.toLowerCase();
        b = b.name.toLowerCase();
        return a < b ? -1 : a > b ? 1 : 0;
      } ) );

    } catch ( err )
    {
      console.log( err );
    }
  };

  // const loadCategories = async () =>
  // {
  //   try
  //   {
  //     const { data } = await axios.get( "/categories" );
  //     setCategories( data );
  //   } catch ( error )
  //   {
  //     console.log( error );
  //   }
  // };

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

      {/* <pre>{ JSON.stringify( { checked, radio }, null, 4 ) }</pre> */ }

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
              <Radio.Group
                onChange={ ( e ) => setRadio( e.target.value ) }
              // e.target.value is the p.array selected in radio
              >
                { prices?.map( p =>
                (
                  <div key={ p._id } style={ { marginLeft: "8px" } }>
                    <Radio value={ p.array }> { p.name } </Radio>
                  </div>

                ) ) }
              </Radio.Group>
            </div>

            {/* Reset Button */ }
            <div className='p-5 pt-0'>
              <button
                className='btn btn-outline-secondary col-12'
                onClick={ () => window.location.reload() }
              >
                Reset
              </button>

            </div>
          </div>


          <div className='col-md-9'>

            <h2
              className='p-3 mt-2 mb-2 h4 bg-light text-center'>
              { products?.length } Products</h2>

            <div className='row' style={ { height: "120vh", overflow: "scrolls" } }>

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