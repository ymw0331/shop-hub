import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import LoadingGIF from "../../images/loading.gif"

export default function Loading ()
{
  //state
  const [ count, setCount ] = useState( 300 );

  //hooks
  const navigate = useNavigate();

  useEffect( () =>
  {
    const interval = setInterval( () =>
    {
      setCount( ( currentCount ) => --currentCount );
    }, 1000 );

    //redirect once count is equal to 0
    count === 0 && navigate( "/login" );

    // cleanup
    return () => clearInterval( interval );

  }, [ count ] );

  return ( <div className='d-flex justify-content-center align-items-center vh-100'>
    {/* Redirecting you in { count } seconds */}
  
  <img src={LoadingGIF} alt/>
  </div> );
}