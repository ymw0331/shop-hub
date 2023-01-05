import { useState, createContext, useContext } from 'react';

const AuthContext = createContext();

const AuthProvider = ( { children } ) =>
{
  const [ auth, setAuth ] = useState( {
    user: null,
    token: ""
  } );

  return (
    <AuthContext.Provider value={ [ auth, setAuth ] }>
      { children } 
      {/* allow all the children of this prosp to access auth and setAuth */}
    </AuthContext.Provider>
  );
};

export 