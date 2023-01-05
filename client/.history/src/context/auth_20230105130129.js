import { useState, createContext, useContext } from 'react';

const AuthContext = createContext();

const AuthProvider = ( { children } ) =>
{
  const [ auth, setAuth ] = useState( {
    user: null,
    token: ""
  } );

  return(
    <AuthContext.Provider>
      
    </AuthContext.Provider>
  )
};