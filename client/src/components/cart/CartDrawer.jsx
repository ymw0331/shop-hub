import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/cart';
import { useAuth } from '../../context/auth';
import { useNavigate } from 'react-router-dom';
import { formatCurrency, calculateStock } from '../../lib/utils';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import toast from 'react-hot-toast';

export default function CartDrawer({ isOpen, onClose }) {
  const [cart, setCart] = useCart();
  const [auth] = useAuth();
  const navigate = useNavigate();

  const updateQuantity = (product, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(product._id);
      return;
    }

    const stock = calculateStock(product.quantity, product.sold);
    if (newQuantity > stock) {
      toast.error(`Only ${stock} items available in stock`);
      return;
    }

    const updatedCart = cart.map(item => {
      if (item._id === product._id) {
        return { ...item, cartQuantity: newQuantity };
      }
      return item;
    });

    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeFromCart = (productId) => {
    const updatedCart = cart.filter(item => item._id !== productId);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    toast.success('Item removed from cart');
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      return total + (item.price * (item.cartQuantity || 1));
    }, 0);
  };

  const getItemCount = () => {
    return cart.reduce((total, item) => total + (item.cartQuantity || 1), 0);
  };

  const handleCheckout = () => {
    onClose();
    navigate('/cart');
  };

  const freeShippingThreshold = 100;
  const cartTotal = getCartTotal();
  const freeShippingProgress = Math.min((cartTotal / freeShippingThreshold) * 100, 100);
  const amountForFreeShipping = Math.max(freeShippingThreshold - cartTotal, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Shopping Cart</h2>
                <Badge variant="primary" size="sm">{getItemCount()}</Badge>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Free Shipping Progress */}
            {cartTotal > 0 && cartTotal < freeShippingThreshold && (
              <div className="px-4 py-3 bg-blue-50 dark:bg-blue-900/30 border-b border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  Add {formatCurrency(amountForFreeShipping)} more for free shipping!
                </p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-primary rounded-full h-2 transition-all duration-300"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>
            )}

            {cartTotal >= freeShippingThreshold && (
              <div className="px-4 py-3 bg-green-50 dark:bg-green-900/30 border-b border-gray-200 dark:border-gray-700">
                <p className="text-sm text-green-700 dark:text-green-400 font-medium">
                  ✓ You qualify for free shipping!
                </p>
              </div>
            )}

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                  <ShoppingCart className="h-16 w-16 mb-4 text-gray-300 dark:text-gray-600" />
                  <p className="text-lg font-medium mb-2 text-gray-900 dark:text-gray-100">Your cart is empty</p>
                  <p className="text-sm mb-4">Add items to get started</p>
                  <Button onClick={() => { onClose(); navigate('/shop'); }}>
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => {
                    const stock = calculateStock(item.quantity, item.sold);
                    const itemQuantity = item.cartQuantity || 1;
                    
                    return (
                      <motion.div
                        key={item._id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        className="flex gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <img
                          src={`${process.env.REACT_APP_API}/product/photo/${item._id}`}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-md"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-sm line-clamp-1 text-gray-900 dark:text-gray-100">{item.name}</h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                            {formatCurrency(item.price)}
                          </p>
                          {stock <= 5 && (
                            <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                              Only {stock} left in stock
                            </p>
                          )}
                          
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => updateQuantity(item, itemQuantity - 1)}
                              className="p-1 hover:bg-white dark:hover:bg-gray-600 rounded transition-colors"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="px-3 py-1 bg-white dark:bg-gray-600 rounded text-sm font-medium text-gray-900 dark:text-gray-100">
                              {itemQuantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item, itemQuantity + 1)}
                              className="p-1 hover:bg-white dark:hover:bg-gray-600 rounded transition-colors"
                              disabled={itemQuantity >= stock}
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end justify-between">
                          <button
                            onClick={() => removeFromCart(item._id)}
                            className="p-1 hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500 dark:text-red-400 rounded transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                            {formatCurrency(item.price * itemQuantity)}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span className="text-xl font-bold text-gray-900 dark:text-gray-100">{formatCurrency(cartTotal)}</span>
                </div>
                
                <Button
                  onClick={handleCheckout}
                  className="w-full"
                  size="lg"
                >
                  {auth?.token ? (
                    <>
                      Proceed to Checkout
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  ) : (
                    'Login to Checkout'
                  )}
                </Button>
                
                <button
                  onClick={() => { onClose(); navigate('/shop'); }}
                  className="w-full py-2 text-center text-sm text-gray-600 hover:text-primary transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}