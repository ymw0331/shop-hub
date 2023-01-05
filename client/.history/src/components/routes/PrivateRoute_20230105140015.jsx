import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../context/auth';

const PrivateRouter = () =>
{
  //context
  const [ auth, setAuth ] = useAuth();

  //state
  const [ ok, setOk ] = useState( "" );


  return ( <div></div> );
};