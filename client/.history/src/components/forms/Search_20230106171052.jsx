import axios from 'axios';
import { useSearch } from '../../context/search';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export default function Search ()
{


  //hooks
  const [ values, setValues ] = useSearch(); //values contains keyword and result

  const navigate = useNavigate();


  const handleSubmit = async ( e ) =>
  {
    e.preventDefault();
    try
    {
      const { data } = await axios.get( `/products/search/${ values.keyword }` );
      console.log( data );
      setValues( { ...values, results: data } );
      navigate( "/search" );

    } catch ( error )
    {
      console.log( error );
      toast.error( data.error );
    }
  };


  return (
    <form className='d-flex' onSubmit={ handleSubmit }>
      <input
        type="search"
        style={ { borderRadius: "0px" } }
        className="form-control"
        placeholder="Search"
        onChange={ ( e ) => setValues( { ...values, keyword: e.target.value } ) }
        value={ values.keyword }
      />

      <button
        className='btn btn-outline-primary'
        style={ { borderRadius: "0px" } }
        type='submit'
      >
        Search
      </button>
    </form>
  );
}