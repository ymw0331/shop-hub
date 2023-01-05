import { useNavigate } from 'react-router-dom';
import { useState } from "react";

export default function Loading ()
{
  //state
  const [ count, setCount ] = useState( 3 );

  //hooks
  const navigate = useNavigate();

  useEffect( () =>
  {

  } , [count]);


}