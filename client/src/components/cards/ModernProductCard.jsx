import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Eye, Package, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useCart } from '../../context/cart';
import { useCartDrawer } from '../../context/cartDrawer';
import { formatCurrency, calculateStock, isInStock, truncateText } from '../../lib/utils';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { cn } from '../../lib/utils';

export default function ModernProductCard({ product }) {
  const [cart, setCart] = useCart();
  const [, setCartDrawerOpen] = useCartDrawer();
  const navigate = useNavigate();
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const stock = calculateStock(product.quantity, product.sold);
  const inStock = isInStock(product.quantity, product.sold);
  const isPopular = product.sold > 10;
  const isNew = new Date(product.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    
    if (!inStock) {
      toast.error('This product is out of stock');
      return;
    }

    // Check if item already in cart
    const existingItem = cart.find(item => item._id === product._id);
    if (existingItem) {
      // Update quantity if item exists
      const updatedCart = cart.map(item => {
        if (item._id === product._id) {
          const newQuantity = (item.cartQuantity || 1) + 1;
          if (newQuantity > stock) {
            toast.error(`Only ${stock} items available`);
            return item;
          }
          return { ...item, cartQuantity: newQuantity };
        }
        return item;
      });
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    } else {
      // Add new item with quantity 1
      const newItem = { ...product, cartQuantity: 1 };
      setCart([...cart, newItem]);
      localStorage.setItem('cart', JSON.stringify([...cart, newItem]));
    }
    
    toast.success('Added to cart');
    setCartDrawerOpen(true);
  };

  const handleQuickView = (e) => {
    e.stopPropagation();
    navigate(`/product/${product.slug}`);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
      onClick={() => navigate(`/product/${product.slug}`)}
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {isPopular && (
          <Badge variant="sale" size="sm" className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            {product.sold} sold
          </Badge>
        )}
        {isNew && (
          <Badge variant="new" size="sm">
            New
          </Badge>
        )}
        {!inStock && (
          <Badge variant="danger" size="sm">
            Out of Stock
          </Badge>
        )}
        {inStock && stock <= 5 && (
          <Badge variant="warning" size="sm">
            Only {stock} left
          </Badge>
        )}
      </div>

      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {imageLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
        
        {!imageError ? (
          <img
            src={`${process.env.REACT_APP_API}/product/photo/${product._id}`}
            alt={product.name}
            onLoad={() => setImageLoading(false)}
            onError={() => {
              setImageError(true);
              setImageLoading(false);
            }}
            className={cn(
              "w-full h-full object-cover transition-transform duration-300 group-hover:scale-110",
              imageLoading && "opacity-0"
            )}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <Package className="h-20 w-20 text-gray-300" />
          </div>
        )}

        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleQuickView}
            className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
            title="Quick View"
          >
            <Eye className="h-5 w-5 text-gray-700" />
          </motion.button>
          
          {inStock && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleAddToCart}
              className="p-3 bg-primary text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
              title="Add to Cart"
            >
              <ShoppingCart className="h-5 w-5" />
            </motion.button>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Category */}
        {product.category && (
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
            {product.category.name}
          </p>
        )}

        {/* Title */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {truncateText(product.description, 80)}
        </p>

        {/* Price and Stock Info */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(product.price)}
            </p>
            {product.shipping && (
              <p className="text-xs text-green-600 mt-1">Free Shipping</p>
            )}
          </div>
          
          <div className="text-right">
            {inStock ? (
              <p className="text-sm text-green-600 font-medium">In Stock</p>
            ) : (
              <p className="text-sm text-red-600 font-medium">Out of Stock</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={handleAddToCart}
            disabled={!inStock}
            className="flex-1"
            size="sm"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
          <Button
            onClick={handleQuickView}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            View Details
          </Button>
        </div>
      </div>
    </motion.div>
  );
}