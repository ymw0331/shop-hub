import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useCategory ()
{
  const [ categories, setCategories ] = useState( [] );

  useEffect( () =>
  {
    loadCategories();
  }, [] );

  // const loadCategories = async () =>
  // {
  //   try
  //   {
  //     const { data } = await axios.get( '/categories' );
  //     setCategories( data );
  //   } catch ( error )
  //   {
  //     console.log( error );
  //   }
  // };

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

  return categories;
}