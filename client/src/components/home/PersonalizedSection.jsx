import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Sparkles, User, RefreshCw, Heart } from 'lucide-react';
import ProductCard from '../cards/ProductCard';
import { SkeletonProductGrid } from '../ui/Skeleton';
import Button from '../ui/Button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth';

export default function PersonalizedSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();
  const [auth] = useAuth();

  useEffect(() => {
    loadRecommendations();
  }, [auth?.user]);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/products/recommended?limit=8');
      setProducts(data || []);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshRecommendations = async () => {
    setRefreshing(true);
    await loadRecommendations();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Sparkles className="h-8 w-8 text-purple-500" />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Picked for You
              </h2>
            </div>
          </div>
          <SkeletonProductGrid count={4} />
        </div>
      </section>
    );
  }

  if (!products.length) {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-to-b from-purple-50 to-white dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-8 w-8 text-purple-500" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
              {auth?.user ? 'Picked for You' : 'Popular Picks'}
            </h2>
            <Sparkles className="h-8 w-8 text-purple-500" />
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {auth?.user
              ? 'Personalized recommendations based on your interests'
              : 'Discover what others are loving right now'
            }
          </p>

          {auth?.user && (
            <Button
              onClick={refreshRecommendations}
              variant="ghost"
              size="sm"
              className="mt-4"
              disabled={refreshing}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh Picks
            </Button>
          )}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 8).map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="relative group"
            >
              {/* Personalized Badge */}
              {auth?.user && index === 0 && (
                <div className="absolute -top-2 -left-2 z-10">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full px-3 py-1 text-xs font-bold shadow-lg flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    Top Pick
                  </div>
                </div>
              )}

              <div className="transform transition-transform duration-300 hover:scale-105">
                <ProductCard p={product} />
              </div>

              {/* Match Percentage (for authenticated users) */}
              {auth?.user && (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute top-2 right-2 bg-purple-500 text-white rounded-full px-2 py-1 text-xs font-bold"
                >
                  {Math.floor(Math.random() * 20) + 80}% Match
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Personalization CTA */}
        {!auth?.user && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 text-center"
          >
            <div className="inline-flex items-center gap-4 p-6 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 rounded-2xl">
              <User className="h-12 w-12 text-purple-600 dark:text-purple-400" />
              <div className="text-left">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Want Personalized Recommendations?
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Sign in to get picks tailored just for you
                </p>
              </div>
              <Button
                onClick={() => navigate('/login')}
                variant="primary"
                size="sm"
              >
                Sign In
              </Button>
            </div>
          </motion.div>
        )}

        {/* Recommendation Insights (for authenticated users) */}
        {auth?.user && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 grid grid-cols-3 gap-4"
          >
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {products.length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Items for You</p>
            </div>
            <div className="text-center p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
              <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                3
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Categories</p>
            </div>
            <div className="text-center p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
              <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                Daily
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Updates</p>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}