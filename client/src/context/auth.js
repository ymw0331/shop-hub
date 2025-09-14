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
  
  // Update axios headers when auth changes
  useEffect( () =>
  {
    axios.defaults.headers.common[ 'Authorization' ] = auth?.token ? `Bearer ${auth.token}` : '';
  }, [ auth?.token ] );

  useEffect( () =>
  {
    const data = localStorage.getItem( "auth" );
    if ( data )
    {
      //grab data and put into state
      const parsed = JSON.parse( data );
      setAuth( { user: parsed.user, token: parsed.token } );
      // Immediately set the Bearer header for existing tokens
      axios.defaults.headers.common[ 'Authorization' ] = parsed.token ? `Bearer ${parsed.token}` : '';
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