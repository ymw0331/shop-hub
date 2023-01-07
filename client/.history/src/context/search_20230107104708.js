import { useState, createContext, useContext } from 'react';
import axios from 'axios';

const SearchContext = createContext();

const SearchProvider = ( { children } ) =>
{
  const [ values, setValues ] = useState( {
    keyword: "",
    results: []
  } );


  return (
    < SearchContext.Provider value={ [ values, setValues ] }>
      { children }
    </ SearchContext.Provider>
  );
};

const useSearch = () => useContext( SearchContext );

export { useSearch, SearchProvider };