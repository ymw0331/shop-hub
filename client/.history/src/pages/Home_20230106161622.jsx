import { useState, useEffect } from 'react';
import axios from 'axios';
import Jumbotron from '../components/cards/Jumbotron';
import ProductCard from '../components/cards/ProductCard';

export default function Home ()
{
  const [ products, setProducts ] = useState( [] );
  const [ total, setTotal ] = useState( [] );
  const [ page, setPage ] = useState( 1 );
  const [ loading, setLoading ] = useState( false );


  useEffect( () =>
  {
    loadProducts();
    getTotal();
  }, [] );

  useEffect( () =>
  {
    if ( page === 1 ) return;
    loadMore();
  }, [ page ] );

  const getTotal = async () =>
  {
    try
    {
      const { data } = await axios.get( "/products-count" );
      setTotal( data );
    } catch ( error )
    {
      console.log( error );
    }
  };

  const loadProducts = async () =>
  {
    try
    {
      const { data } = await axios.get( `/list-products/${ page }` );
      setProducts( data );

    } catch ( error )
    {
      console.log( error );
    }
  };

  const loadMore = async () =>
  {
    try
    {
      setLoading( true );
      const { data } = await axios.get( `/list-products/${ page }` );
      setProducts( [ ...products, ...data ] );
      setLoading( false );

    } catch ( error )
    {
      console.log( error );
      setLoading( false );
    }
  };

  const arr = [ ...products ];
  const productSortedBySold = arr?.sort( ( a, b ) => ( a.sold < b.sold ? 1 : -1 ) );

  return (
    <div>
      <Jumbotron
        title="Hello World" subTitle='Welcome to React E-Commerce'
      />

      <div className='row'>
        {/* total of 12 col */ }
        <div className='col-md-6'>
          <h2 className='p-3 mt-2 mb-2 h4 bg-light text-center'>
            New Arrivals
          </h2>
          <div className='row'>
            { products?.map( p => (
              <div className='col-md-6' key={ p._id }>
                <ProductCard p={ p } />
              </div>
            ) ) }
          </div>

        </div>

        <div className='col-md-6'>
          <h2 className='p-3 mt-2 mb-2 h4 bg-light text-center'>
            Best Sellers
          </h2>
          <div className='row'>
            { productSortedBySold?.map( p => (
              <div className='col-md-6' key={ p._id }>
                <ProductCard p={ p } />
              </div>
            ) ) }
          </div>
        </div>

      </div>


      {/* Get Total */ }
      <div className='container text-center p-5 '>
        { products && products.length < total && (
          <button
            className='btn btn-warning btn-lg col-md-6'
            disabled={ loading }
            onClick={ e =>
            {
              e.preventDefault();
              setPage( page + 1 );
            } }
          >
            { loading ? "Loading" : "Load more" }
          </button>
        ) }

      </div>

    </div>
  );
}

