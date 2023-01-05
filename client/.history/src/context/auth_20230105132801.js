import { useState, createContext, useContext } from 'react';
import { useEffect } from 'react';

const AuthContext = createContext();

const AuthProvider = ( { children } ) =>
{
  const [ auth, setAuth ] = useState( {
    user: null,
    token: ""
  } );

  useEffect( () =>
  {
    const data = localStorage.getItem( "auth" );

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