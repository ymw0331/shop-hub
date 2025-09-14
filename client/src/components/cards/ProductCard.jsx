import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Eye, Package, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useCart } from '../../context/cart';
import { formatCurrency, calculateStock, isInStock, truncateText } from '../../lib/utils';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { cn } from '../../lib/utils';

export default function ProductCard({ p: product, viewMode }) {
  const [cart, setCart] = useCart();
  const navigate = useNavigate();
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const stock = calculateStock(product.quantity, product.sold);
  const inStock = isInStock(product.quantity, product.sold);
  const isPopular = product.sold > 10;
  const isNew = new Date(product.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    
    setCart([...cart, product]);
    localStorage.setItem('cart', JSON.stringify([...cart, product]));
    toast.success('Added to cart');
  };

  const handleQuickView = (e) => {
    e.stopPropagation();
    navigate(`/product/${product.slug}`);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group relative bg-white dark:bg-gray-900 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
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
      <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
        {imageLoading && (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
        )}
        
        {!imageError ? (
          <img
            src={`${process.env.REACT_APP_API}/product/photo/${product.id}`}
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
          <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
            <Package className="h-20 w-20 text-gray-300" />
          </div>
        )}

        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleQuickView}
            className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Quick View"
          >
            <Eye className="h-5 w-5 text-gray-700 dark:text-gray-200" />
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
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
            {product.category.name}
          </p>
        )}

        {/* Title */}
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
          {truncateText(product.description, 80)}
        </p>

        {/* Price and Stock Info */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
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