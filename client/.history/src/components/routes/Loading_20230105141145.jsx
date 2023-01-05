import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";

export default function Loading ()
{
  //state
  const [ count, setCount ] = useState( 3 );

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

  }, [ count ] );


}