import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from "react";
import LoadingGIF from "../../images/loading.gif";

export default function Loading ( { path = "login" } )
{
  //state
  const [ count, setCount ] = useState( 3 );

  //hooks
  const navigate = useNavigate();
  const location = useLocation();
  // console.log( location );


  useEffect( () =>
  {
    const interval = setInterval( () =>
    {
      setCount( ( currentCount ) => --currentCount );
    }, 1000 );

    //redirect once count is equal to 0
    count === 0 &&
      navigate( `/${ path }`, {
        state: location.pathname
      } );

    // cleanup
    return () => clearInterval( interval );

  }, [ count, navigate, path, location.pathname ] );

  return ( 
    <div className='flex justify-center items-center bg-white dark:bg-gray-900 min-h-[90vh]'>
      {/* Redirecting you in { count } seconds */ }
      <img src={ LoadingGIF } alt="loading" className="w-96 dark:opacity-80" />
    </div> 
  );
}