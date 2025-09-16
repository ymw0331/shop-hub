import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  ChevronRight, Package, Grid, List, 
  ArrowLeft, Tag, TrendingUp, Clock
} from 'lucide-react';
import PageContainer from '../components/layout/PageContainer';
import PageHeader from '../components/layout/PageHeader';
import ProductCard from '../components/cards/ProductCard';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import Skeleton from '../components/ui/Skeleton';
import { cn } from '../lib/utils';
import usePageTitle from '../hooks/usePageTitle';

export default function CategoryView() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState({});
  usePageTitle(category.name || 'Category');
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');
  
  const params = useParams();

  const loadProductsByCategory = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/products-by-category/${params.slug}`);
      setCategory(data.category);
      setProducts(data.products);
      sortProducts(data.products, sortBy);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [params.slug, sortBy]);

  useEffect(() => {
    if (params?.slug) loadProductsByCategory();
  }, [params?.slug, loadProductsByCategory]);

  const sortProducts = (productsToSort, sortOption) => {
    let sorted = [...productsToSort];
    switch (sortOption) {
      case 'priceLow':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'priceHigh':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        sorted.sort((a, b) => (b.sold || 0) - (a.sold || 0));
        break;
      case 'newest':
      default:
        sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    setProducts(sorted);
  };

  const handleSortChange = (e) => {
    const newSort = e.target.value;
    setSortBy(newSort);
    sortProducts(products, newSort);
  };

  return (
    <PageContainer>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
        <Link to="/" className="hover:text-indigo-600 transition-colors">
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link to="/categories" className="hover:text-indigo-600 transition-colors">
          Categories
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900 dark:text-gray-100 font-medium">{category?.name}</span>
      </nav>

      {/* Back Button */}
      <Link
        to="/categories"
        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to categories
      </Link>

      {/* Category Header */}
      <PageHeader
        title={category?.name || 'Category'}
        subtitle={
          loading
            ? 'Loading products...'
            : products.length === 1
            ? '1 product found'
            : `${products.length} products found`
        }
        className="mb-8"
      >
        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center gap-2 text-white/80">
            <Tag className="h-5 w-5" />
            <span>Premium collection</span>
          </div>
          {products.length > 0 && (
            <div className="flex items-center gap-2 text-white/80">
              <TrendingUp className="h-5 w-5" />
              <span>{products.filter(p => p.sold > 5).length} trending items</span>
            </div>
          )}
        </div>
      </PageHeader>

      {/* Toolbar */}
      {!loading && products.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            <span className="text-gray-600 dark:text-gray-400">
              Showing {products.length} {products.length === 1 ? 'product' : 'products'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 border border-gray-300 dark:border-gray-600 rounded-lg p-1 bg-white dark:bg-gray-800">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  "p-2 rounded transition-colors",
                  viewMode === 'grid' 
                    ? "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400" 
                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                )}
                aria-label="Grid view"
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  "p-2 rounded transition-colors",
                  viewMode === 'list' 
                    ? "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400" 
                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                )}
                aria-label="List view"
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            {/* Sort Dropdown */}
            <Select
              value={sortBy}
              onChange={handleSortChange}
              className="w-48"
            >
              <option value="newest">Newest First</option>
              <option value="popular">Most Popular</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
            </Select>
          </div>
        </div>
      )}

      {/* Products Grid/List */}
      {loading ? (
        <div className={cn(
          "grid gap-6",
          viewMode === 'grid' 
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            : "grid-cols-1"
        )}>
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-96" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <Package className="h-20 w-20 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No products in this category
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Check back later for new arrivals
          </p>
          <Link to="/shop">
            <Button>
              Browse All Products
            </Button>
          </Link>
        </motion.div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "grid gap-6",
              viewMode === 'grid' 
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1"
            )}
          >
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <ProductCard p={product} viewMode={viewMode} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Category Info Section */}
      {!loading && products.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-white dark:bg-gray-800 rounded-lg">
              <Tag className="h-5 w-5 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              About {category.name}
            </h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Explore our carefully curated collection of {category.name.toLowerCase()} products. 
            From premium brands to everyday essentials, find exactly what you need with our 
            competitive prices and fast shipping.
          </p>
          <div className="flex items-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Clock className="h-4 w-4" />
              <span>Updated daily</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <TrendingUp className="h-4 w-4" />
              <span>{products.filter(p => p.sold > 0).length} best sellers</span>
            </div>
          </div>
        </motion.div>
      )}
    </PageContainer>
  );
}