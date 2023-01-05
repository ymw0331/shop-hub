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

  }, [ count ] );

  return ( <div className='d-flex justify-content-center align-items-center'
    style={ { height: "90vh" } } >

    {/* Redirecting you in { count } seconds */ }
    <img src={ LoadingGIF } alt="loading" style={ { width: "400px" } } />
  </div> );
}