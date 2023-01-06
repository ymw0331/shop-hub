import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearch } from '../../context/search';

export default function Search ()
{


  //hooks
  const [ values, setValues ] = useSearch(); //values contains keyword and result

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
        onChange={ ( e ) => setValues({...values, keyword}) }
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