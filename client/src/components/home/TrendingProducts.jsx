import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { TrendingUp, Eye, ShoppingCart, Flame } from 'lucide-react';
import ProductCard from '../cards/ProductCard';
import { SkeletonProductGrid } from '../ui/Skeleton';
import Button from '../ui/Button';
import { useNavigate } from 'react-router-dom';

export default function TrendingProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadTrendingProducts();
  }, []);

  const loadTrendingProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/products/trending?limit=6');
      setProducts(data || []);
    } catch (error) {
      console.error('Error loading trending products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-b from-orange-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Flame className="h-8 w-8 text-orange-500 animate-pulse" />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Trending Now
              </h2>
            </div>
          </div>
          <SkeletonProductGrid count={6} />
        </div>
      </section>
    );
  }

  if (!products.length) {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-to-b from-orange-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-3">
            <Flame className="h-8 w-8 text-orange-500 animate-pulse" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Trending Now
            </h2>
            <span className="ml-2 px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300 rounded-full text-sm font-medium">
              Hot 🔥
            </span>
          </div>
          <Button
            onClick={() => navigate('/shop?sort=trending')}
            variant="ghost"
            size="sm"
          >
            View All Trending
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="relative"
            >
              {/* Trending Badge */}
              {index < 3 && (
                <div className="absolute -top-2 -right-2 z-10">
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full px-3 py-1 text-xs font-bold shadow-lg">
                    #{index + 1} Trending
                  </div>
                </div>
              )}

              <div className="relative group">
                <ProductCard p={product} />

                {/* Social Proof Indicators */}
                {product.socialProof && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute bottom-2 left-2 right-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-2 space-y-1"
                  >
                    {product.socialProof.viewingNow > 0 && (
                      <div className="flex items-center gap-2 text-xs">
                        <Eye className="h-3 w-3 text-green-500" />
                        <span className="text-gray-700 dark:text-gray-300">
                          {product.socialProof.viewingNow} people viewing
                        </span>
                      </div>
                    )}
                    {product.socialProof.soldRecently > 0 && (
                      <div className="flex items-center gap-2 text-xs">
                        <TrendingUp className="h-3 w-3 text-blue-500" />
                        <span className="text-gray-700 dark:text-gray-300">
                          {product.socialProof.soldRecently} sold in last hour
                        </span>
                      </div>
                    )}
                    {product.socialProof.inCarts > 0 && (
                      <div className="flex items-center gap-2 text-xs">
                        <ShoppingCart className="h-3 w-3 text-purple-500" />
                        <span className="text-gray-700 dark:text-gray-300">
                          {product.socialProof.inCarts} in carts
                        </span>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trending Categories */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 p-6 bg-gradient-to-r from-orange-100 to-yellow-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                🔥 Trending Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                {['Electronics', 'Fashion', 'Home Decor', 'Sports'].map(category => (
                  <span
                    key={category}
                    className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-orange-200 dark:hover:bg-orange-900 transition-colors"
                    onClick={() => navigate(`/categories?filter=${category.toLowerCase()}`)}
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400">Updated</p>
              <p className="text-xs text-gray-500 dark:text-gray-500">Every hour</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}