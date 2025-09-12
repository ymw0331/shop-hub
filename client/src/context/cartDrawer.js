import { useState, useContext, createContext } from 'react';

const CartDrawerContext = createContext();

const CartDrawerProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <CartDrawerContext.Provider value={[isOpen, setIsOpen]}>
      {children}
    </CartDrawerContext.Provider>
  );
};

// hook
const useCartDrawer = () => useContext(CartDrawerContext);

export { useCartDrawer, CartDrawerProvider };