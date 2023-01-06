import Jumbotron from '../components/cards/Jumbotron';

import { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';

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
  return (
    <div>
      <Jumbotron
        title="Hello World"
      />

      { products?.map( p => (
        <div key={ p._id }>
          <p>{ p.name }</p>
          <p>{ moment( p.createdAt ) }</p>
          <p>{ p.sold } sold</p>
          <p>{ p.name }</p>

        </div>
      ) ) }

    </div>
  );
}

