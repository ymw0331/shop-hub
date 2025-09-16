import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ArrowRight, Grid3x3, TrendingUp, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import HeroSection from '../components/hero/HeroSection';
import ProductCard from '../components/cards/ProductCard';
import { SkeletonProductGrid } from '../components/ui/Skeleton';
import Button from '../components/ui/Button';
import usePageTitle from '../hooks/usePageTitle';

export default function Home() {
  usePageTitle('Home');
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const navigate = useNavigate();

  const getTotal = useCallback(async () => {
    try {
      const { data } = await axios.get("/products/count");
      setTotal(data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const loadProducts = useCallback(async () => {
    try {
      setInitialLoading(true);
      const { data } = await axios.get(`/products/${page}`);
      setProducts(data);
      setInitialLoading(false);
    } catch (error) {
      console.log(error);
      setInitialLoading(false);
    }
  }, [page]);

  const loadMore = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/products/${page}`);
      setProducts([...products, ...data]);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, [page, products]);

  useEffect(() => {
    loadProducts();
    getTotal();
  }, [loadProducts, getTotal]);

  useEffect(() => {
    if (page === 1) return;
    loadMore();
  }, [page, loadMore]);

  const productSortedBySold = [...products]?.sort((a, b) => (a.sold < b.sold ? 1 : -1));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <HeroSection />

      {/* Categories Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Shop by Category
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Find what you're looking for in our diverse collection
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Electronics', 'Fashion', 'Home & Garden', 'Sports'].map((category, index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="relative group cursor-pointer"
                onClick={() => navigate('/categories')}
              >
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/10 to-purple-100 p-8 flex flex-col items-center justify-center hover:shadow-lg transition-all">
                  <Grid3x3 className="h-12 w-12 text-primary mb-3" />
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">{category}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">120+ items</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button
              onClick={() => navigate('/categories')}
              variant="outline"
            >
              View All Categories
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Products Sections */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* New Arrivals */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex items-center justify-between mb-6"
              >
                <div className="flex items-center gap-3">
                  <Sparkles className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">New Arrivals</h2>
                </div>
                <Button
                  onClick={() => navigate('/shop')}
                  variant="ghost"
                  size="sm"
                >
                  View All
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </motion.div>

              {initialLoading ? (
                <SkeletonProductGrid count={3} />
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {products?.slice(0, 3).map((p) => (
                    <ProductCard key={p.id} p={p} />
                  ))}
                </div>
              )}
            </div>

            {/* Best Sellers */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex items-center justify-between mb-6"
              >
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Best Sellers</h2>
                </div>
                <Button
                  onClick={() => navigate('/shop')}
                  variant="ghost"
                  size="sm"
                >
                  View All
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </motion.div>

              {initialLoading ? (
                <SkeletonProductGrid count={3} />
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {productSortedBySold?.slice(0, 3).map((p) => (
                    <ProductCard key={p.id} p={p} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Load More */}
          {products && products.length < total && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  setPage(page + 1);
                }}
                loading={loading}
                size="lg"
                variant="outline"
                className="min-w-[200px]"
              >
                {loading ? "Loading..." : `Load More (${products.length} of ${total})`}
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Free Shipping",
                description: "On orders over $100",
                icon: "🚚"
              },
              {
                title: "24/7 Support",
                description: "Dedicated customer service",
                icon: "💬"
              },
              {
                title: "Secure Payment",
                description: "100% secure transactions",
                icon: "🔒"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}