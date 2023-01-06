import { useState, createContext, useContext, useEffect } from 'react';
import axios from 'axios';

const SearchContext = createContext();

const SearchProvider = ( { children } ) =>
{
  const [ values, setValues ] = useState( {
    keyword: "",
    results: []
  } );

  //axios config
  axios.defaults.baseURL = process.env.REACT_APP_API;
  axios.defaults.headers.common[ 'Authorization' ] = auth?.token;

  return (
    < SearchContext.Provider value={ [ values, setValues ] }>
      { children }
      {/* allow all the components base of this props to access auth and setAuth */ }
    </ SearchContext.Provider>
  );
};

const useSearch = () => useContext( AuthContext );
//const [auth, setAuth] = useAuth()
//other component can make use of above context

export { useSearch, AuthProvider };