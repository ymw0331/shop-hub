import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import moment from 'moment';
import {
  ShoppingCart, Share2, Shield, Truck, Package,
  ChevronRight, Minus, Plus, Check, X, Clock,
  ArrowLeft, ZoomIn, Tag, Info
} from 'lucide-react';
import PageContainer from '../components/layout/PageContainer';
import ProductCard from '../components/cards/ProductCard';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { Card, CardContent } from '../components/ui/Card';
import Skeleton from '../components/ui/Skeleton';
import { useCart } from '../context/cart';
import { formatCurrency, calculateStock, isInStock } from '../lib/utils';
import { cn } from '../lib/utils';
import usePageTitle from '../hooks/usePageTitle';

export default function ProductView() {
  const [product, setProduct] = useState({});
  usePageTitle(product.name || 'Product');
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  
  const params = useParams();
  const navigate = useNavigate();
  const [cart, setCart] = useCart();

  useEffect(() => {
    if (params?.slug) loadProduct();
  }, [params?.slug]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/product/${params.slug}`);
      setProduct(data);
      loadRelated(data._id, data.category._id);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const loadRelated = async (productId, categoryId) => {
    try {
      const { data } = await axios.get(
        `/related-products/${productId}/${categoryId}`
      );
      setRelated(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddToCart = () => {
    const existingItem = cart.find(item => item._id === product._id);
    const currentQuantityInCart = existingItem ? existingItem.quantity : 0;
    const stock = calculateStock(product.quantity, product.sold);
    
    if (currentQuantityInCart + quantity > stock) {
      toast.error(`Only ${stock - currentQuantityInCart} items available`);
      return;
    }

    let updatedCart = [...cart];
    if (existingItem) {
      updatedCart = cart.map(item =>
        item._id === product._id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      updatedCart.push({ ...product, quantity });
    }
    
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    toast.success(`${quantity} ${product.name} added to cart`);
  };

  const handleQuantityChange = (action) => {
    const stock = calculateStock(product.quantity, product.sold);
    if (action === 'increase' && quantity < stock) {
      setQuantity(quantity + 1);
    } else if (action === 'decrease' && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton className="h-96 lg:h-[600px]" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-24" />
            <Skeleton className="h-12 w-1/2" />
            <Skeleton className="h-40" />
          </div>
        </div>
      </PageContainer>
    );
  }

  const stock = calculateStock(product.quantity, product.sold);
  const inStock = isInStock(product.quantity, product.sold);

  return (
    <PageContainer>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
        <Link to="/" className="hover:text-indigo-600 transition-colors">
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link to="/shop" className="hover:text-indigo-600 transition-colors">
          Shop
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link
          to={`/category/${product.category?.slug}`}
          className="hover:text-indigo-600 transition-colors"
        >
          {product.category?.name}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900 dark:text-gray-100 font-medium">{product.name}</span>
      </nav>

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to shopping
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative group"
          >
            <div
              className={cn(
                "relative overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800",
                "cursor-zoom-in hover:shadow-xl transition-shadow duration-300"
              )}
              onClick={() => setIsZoomed(!isZoomed)}
            >
              {product.sold > 10 && (
                <Badge
                  variant="danger"
                  className="absolute top-4 left-4 z-10"
                >
                  {product.sold} sold
                </Badge>
              )}
              {stock <= 5 && stock > 0 && (
                <Badge
                  variant="warning"
                  className="absolute top-4 right-4 z-10"
                >
                  Only {stock} left
                </Badge>
              )}
              <img
                src={`${process.env.REACT_APP_API}/product/photo/${product._id}`}
                alt={product.name}
                className={cn(
                  "w-full h-[500px] object-cover transition-transform duration-300",
                  isZoomed ? "scale-150" : "group-hover:scale-105"
                )}
              />
              {!inStock && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">Out of Stock</span>
                </div>
              )}
              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="h-5 w-5 text-gray-700" />
              </div>
            </div>
          </motion.div>

          {/* Thumbnail Images (placeholder for multiple images) */}
          <div className="grid grid-cols-4 gap-2">
            {[...Array(4)].map((_, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={cn(
                  "relative rounded-lg overflow-hidden border-2 transition-all",
                  selectedImage === i
                    ? "border-indigo-500"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                )}
              >
                <img
                  src={`${process.env.REACT_APP_API}/product/photo/${product._id}`}
                  alt={`${product.name} ${i + 1}`}
                  className="w-full h-20 object-cover opacity-70"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Title and Price */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {product.name}
            </h1>
            
            {/* Category Badge */}
            <div className="mb-4">
              <Badge variant="secondary">
                {product.category?.name}
              </Badge>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-indigo-600">
                {formatCurrency(product.price)}
              </span>
              {product.price > 100 && (
                <span className="text-sm text-green-600 font-medium">
                  Free Shipping
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="prose prose-sm text-gray-600 dark:text-gray-400">
            <p>{product.description}</p>
          </div>

          {/* Quantity and Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Quantity:
              </span>
              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                <button
                  onClick={() => handleQuantityChange('decrease')}
                  disabled={quantity <= 1}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-700 dark:text-gray-300"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 py-2 min-w-[50px] text-center text-gray-900 dark:text-gray-100">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange('increase')}
                  disabled={quantity >= stock}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-700 dark:text-gray-300"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {stock} available
              </span>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleAddToCart}
                disabled={!inStock}
                className="flex-1"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  handleAddToCart();
                  navigate('/cart');
                }}
                disabled={!inStock}
              >
                Buy Now
              </Button>
              <Button variant="ghost" size="icon">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4 py-6 border-y border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Truck className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Fast Delivery</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">2-3 business days</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Shield className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Secure Payment</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">100% protected</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Package className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Free Returns</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">30-day policy</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">24/7 Support</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Dedicated help</p>
              </div>
            </div>
          </div>

          {/* Product Meta */}
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              <span>SKU: {product._id?.substring(0, 8).toUpperCase()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              <span>Added {moment(product.createdAt).fromNow()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Related Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {related.slice(0, 5).map((p) => (
              <ProductCard key={p._id} p={p} />
            ))}
          </div>
        </div>
      )}
    </PageContainer>
  );
}