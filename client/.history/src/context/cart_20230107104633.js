import { useState, createContext, useContext, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

const CartProvider = ( { children } ) =>
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