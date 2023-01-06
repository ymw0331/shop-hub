import { useState, createContext, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ( { children } ) =>
{
  const [ auth, setAuth ] = useState( {
    user: null,
    token: ""
  } );

  //axios config
  axios.defaults.baseURL = process.env.REACT_APP_API;
  axios.defaults.headers.common[ 'Authorization' ] = auth?.token;

  useEffect( () =>
  {
    const data = localStorage.getItem( "auth" );
    if ( data )
    {
      //grab data and put into state
      const parsed = JSON.parse( data );
      setAuth( { ...auth, user: parsed.user, token: parsed.token } );
    }
  }, [] );

  return (
    <AuthContext.Provider value={ [ auth, setAuth ] }>
      { children }
      {/* allow all the components base of this props to access auth and setAuth */ }
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext( AuthContext );
//const [auth, setAuth] = useAuth()
//other component can make use of above context

export { useAuth, AuthProvider };