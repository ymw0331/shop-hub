import axios from 'axios';
import { useSearch } from '../../context/search';
import { useNavigate } from 'react-router-dom';

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
    }
  };


  return (
    <form className='flex gap-2' onSubmit={ handleSubmit }>
      <input
        type="search"
        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
        placeholder="Search"
        onChange={ ( e ) => setValues( { ...values, keyword: e.target.value } ) }
        value={ values.keyword }
      />

      <button
        className='px-4 py-2 border border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 font-medium transition-colors'
        type='submit'
      >
        Search
      </button>
    </form>
  );
}