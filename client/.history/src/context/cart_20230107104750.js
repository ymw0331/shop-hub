import { useState, createContext, useContext } from 'react';

const CartContext = createContext();

const CartProvider = ( { children } ) =>
{
  const [ cart ] = useState();


  return (
    < CartContext.Provider value={ [ values, setValues ] }>
      { children }
    </ CartContext.Provider>
  );
};

const useCart = () => useContext( CartContext );

export { useCart, CartProvider };