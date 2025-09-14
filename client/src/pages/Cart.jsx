import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, Trash2, Plus, Minus, ArrowLeft, 
  Truck, Shield, Gift, 
  CreditCard, Package, Sparkles
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/auth';
import { useCart } from '../context/cart';
import PageContainer from '../components/layout/PageContainer';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { formatCurrency, calculateStock } from '../lib/utils';
import { cn } from '../lib/utils';
import usePageTitle from '../hooks/usePageTitle';

export default function Cart() {
  usePageTitle('Shopping Cart');
  const [cart, setCart] = useCart();
  const [auth] = useAuth();
  const [promoCode, setPromoCode] = useState('');
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const navigate = useNavigate();

  const updateQuantity = (productId, action) => {
    const updatedCart = cart.map(item => {
      if (item.id === productId) {
        const stock = calculateStock(item.quantity, item.sold);
        let newQuantity = item.cartQuantity || 1;
        
        if (action === 'increase' && newQuantity < stock) {
          newQuantity++;
        } else if (action === 'decrease' && newQuantity > 1) {
          newQuantity--;
        }
        
        return { ...item, cartQuantity: newQuantity };
      }
      return item;
    });
    
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeFromCart = (productId) => {
    const updatedCart = cart.filter(item => item.id !== productId);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    toast.success('Item removed from cart');
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
    toast.success('Cart cleared');
  };

  const applyPromoCode = () => {
    setIsApplyingPromo(true);
    setTimeout(() => {
      setIsApplyingPromo(false);
      toast.error('Invalid promo code');
    }, 1500);
  };

  const subtotal = cart.reduce((total, item) => total + (item.price * (item.cartQuantity || 1)), 0);
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;
  const freeShippingProgress = Math.min((subtotal / 100) * 100, 100);

  return (
    <PageContainer>
      <PageHeader
        title={`Shopping Cart`}
        subtitle={
          cart.length
            ? `${cart.length} ${cart.length === 1 ? 'item' : 'items'} in your cart`
            : 'Your cart is empty'
        }
      >
        {cart.length > 0 && (
          <div className="flex items-center gap-2 mt-4">
            <Sparkles className="h-5 w-5 text-white/80" />
            <span className="text-white/80">
              {auth?.token ? 'Ready to checkout' : 'Sign in to checkout faster'}
            </span>
          </div>
        )}
      </PageHeader>

      {cart.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-full blur-xl opacity-50" />
            <ShoppingCart className="relative h-24 w-24 text-gray-300 dark:text-gray-600" />
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            Your cart is empty
          </h3>
          
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Looks like you haven't added anything to your cart yet
          </p>
          
          <Link to="/shop">
            <Button size="lg">
              <Package className="h-5 w-5 mr-2" />
              Start Shopping
            </Button>
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Free Shipping Progress */}
            {subtotal < 100 && (
              <Card className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-indigo-600" />
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {formatCurrency(100 - subtotal)} away from free shipping!
                    </span>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {freeShippingProgress.toFixed(0)}%
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${freeShippingProgress}%` }}
                    transition={{ duration: 0.5 }}
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                  />
                </div>
              </Card>
            )}

            {/* Cart Items List */}
            <AnimatePresence>
              {cart.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="p-6">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <Link to={`/product/${item.slug}`}>
                        <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                          <img
                            src={`${process.env.REACT_APP_API}/product/photo/${item.id}`}
                            alt={item.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform"
                          />
                        </div>
                      </Link>

                      {/* Product Details */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <Link to={`/product/${item.slug}`}>
                              <h3 className="font-semibold text-gray-900 dark:text-gray-100 hover:text-indigo-600 transition-colors">
                                {item.name}
                              </h3>
                            </Link>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {item.category?.name}
                            </p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors group"
                          >
                            <Trash2 className="h-4 w-4 text-gray-400 dark:text-gray-500 group-hover:text-red-500" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, 'decrease')}
                              disabled={(item.cartQuantity || 1) <= 1}
                              className={cn(
                                "p-1 rounded-lg transition-colors",
                                (item.cartQuantity || 1) <= 1
                                  ? "bg-gray-100 dark:bg-gray-800 text-gray-300 dark:text-gray-600 cursor-not-allowed"
                                  : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                              )}
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="px-4 py-1 min-w-[50px] text-center font-medium text-gray-900 dark:text-gray-100">
                              {item.cartQuantity || 1}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, 'increase')}
                              disabled={(item.cartQuantity || 1) >= calculateStock(item.quantity, item.sold)}
                              className={cn(
                                "p-1 rounded-lg transition-colors",
                                (item.cartQuantity || 1) >= calculateStock(item.quantity, item.sold)
                                  ? "bg-gray-100 dark:bg-gray-800 text-gray-300 dark:text-gray-600 cursor-not-allowed"
                                  : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                              )}
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <p className="font-semibold text-indigo-600">
                              {formatCurrency(item.price * (item.cartQuantity || 1))}
                            </p>
                            {(item.cartQuantity || 1) > 1 && (
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {formatCurrency(item.price)} each
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Clear Cart Button */}
            <div className="flex justify-between items-center pt-4">
              <Link to="/shop">
                <Button variant="ghost">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Continue Shopping
                </Button>
              </Link>
              <Button variant="outline" onClick={clearCart}>
                Clear Cart
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Order Summary
                </h3>

                {/* Promo Code */}
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Promo code
                  </label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      onClick={applyPromoCode}
                      loading={isApplyingPromo}
                      disabled={!promoCode || isApplyingPromo}
                    >
                      Apply
                    </Button>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      Shipping
                      {shipping === 0 && (
                        <span className="text-xs text-green-600">(Free)</span>
                      )}
                    </span>
                    <span>{formatCurrency(shipping)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Tax</span>
                    <span>{formatCurrency(tax)}</span>
                  </div>
                  <div className="pt-3 border-t">
                    <div className="flex justify-between text-lg font-semibold">
                      <span className="text-gray-900 dark:text-gray-100">Total</span>
                      <span className="text-indigo-600">{formatCurrency(total)}</span>
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                {auth?.token ? (
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={() => navigate('/checkout')}
                  >
                    <CreditCard className="h-5 w-5 mr-2" />
                    Proceed to Checkout
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={() => navigate('/login', { state: '/checkout' })}
                    >
                      Sign in to Checkout
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => navigate('/checkout')}
                    >
                      Checkout as Guest
                    </Button>
                  </div>
                )}

                {/* Benefits */}
                <div className="mt-6 pt-6 border-t space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span>Secure checkout</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <Truck className="h-4 w-4 text-blue-600" />
                    <span>Fast delivery</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <Gift className="h-4 w-4 text-purple-600" />
                    <span>Gift wrapping available</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Recently Viewed Section */}
      {cart.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16"
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
            You might also like
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Placeholder for recommended products */}
            <div className="text-center text-gray-500 dark:text-gray-400 col-span-full py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
              Recommended products will appear here
            </div>
          </div>
        </motion.div>
      )}
    </PageContainer>
  );
}