import { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import Jumbotron from '../components/cards/Jumbotron';

export default function Home ()
{
  const [ products, setProducts ] = useState( [] );

  useEffect( () =>
  {
    loadProducts();
  }, [] );

  const loadProducts = async () =>
  {
    try
    {
      const { data } = await axios.get( `/products` );
      setProducts( data );

    } catch ( error )
    {
      console.log( error );
    }

  };

  const arr = [ ...products ];
  const sortedBySold = arr?.sold((a,b) => (a.sold < b.sold) )

  return (
    <div>
      <Jumbotron
        title="Hello World" subTitle='Welcome to React E-Commerce'
      />

      { products?.map( p => (
        <div key={ p._id }>
          <p>{ p.name }</p>
          <p>{ moment( p.createdAt ).fromNow() }</p>
          <p>{ p.sold } sold</p>

        </div>
      ) ) }

    </div>
  );
}

