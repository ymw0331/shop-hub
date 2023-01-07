import { useState, createContext, useContext, useEffect } from 'react';

const CartContext = createContext();

const CartProvider = ( { children } ) =>
{
  const [ values, setValues ] = useState( {
    keyword: "",
    results: []
  } );


  return (
    < CartContext.Provider value={ [ values, setValues ] }>
      { children }
    </ CartContext.Provider>
  );
};

const useCart = () => useContext( CartContext );

export { useCart, CartProvider };