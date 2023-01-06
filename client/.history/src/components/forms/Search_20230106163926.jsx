import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Search ()
{
  const [ keyword, setKeyword ] = useState( "" );
  const [ results, setResults ] = useState( [] );

  const handleSubmit = async ( e ) =>
  {
    try
    {

      const { data } = await axios.get( `/products/search` );

    } catch ( error )
    {
      console.log( error );
    }
  };


  return (
    <form className='d-flex'>
      <input
        type="search"
        style={ { borderRadius: "0px" } }
        className="form-control"
        placeholder="Search"
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