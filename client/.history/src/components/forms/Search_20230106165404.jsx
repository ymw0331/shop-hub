import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearch } from '../../context/search';

export default function Search ()
{
  const [ keyword, setKeyword ] = useState( "" );
  const [ results, setResults ] = useState( [] );

  //hooks
  const [ values, setValues ] = useSearch();

  const handleSubmit = async ( e ) =>
  {
    e.preventDefault();
    try
    {
      const { data } = await axios.get( `/products/search/${ keyword }` );
      // console.log( data );
      setValues( { ...values, results: data } );

    } catch ( error )
    {
      console.log( error );
    }
  };


  return (
    <form className='d-flex' onSubmit={ handleSubmit }>
      <input
        type="search"
        style={ { borderRadius: "0px" } }
        className="form-control"
        placeholder="Search"
        onChange={ ( e ) => setKeyword( e.target.value ) }
      />

      <button
        className='btn btn-outline-primary'
        style={ { borderRadius: "0px" } }
        type='submit'
      >Search
      </button>
    </form>
  );
}