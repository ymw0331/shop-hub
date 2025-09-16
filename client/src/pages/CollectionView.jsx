import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Home, ChevronRight, Filter, Grid, List } from 'lucide-react';
import ProductCard from '../components/cards/ProductCard';
import { SkeletonProductGrid } from '../components/ui/Skeleton';
import usePageTitle from '../hooks/usePageTitle';

export default function CollectionView() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [collection, setCollection] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('featured');

  usePageTitle(collection?.name || 'Collection');

  useEffect(() => {
    loadCollection();
  }, [slug]);

  const loadCollection = async () => {
    try {
      setLoading(true);

      // Try to fetch collection from API
      try {
        const { data } = await axios.get(`/collections/${slug}`);
        setCollection(data);

        // If collection has products, use them
        if (data.products && data.products.length > 0) {
          setProducts(data.products);
        } else {
          // Otherwise fetch products separately
          await loadCollectionProducts();
        }
      } catch (error) {
        // If API fails, use default collection data
        const defaultCollection = getDefaultCollection();
        setCollection(defaultCollection);
        await loadCollectionProducts();
      }
    } catch (error) {
      console.error('Error loading collection:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCollectionProducts = async () => {
    try {
      // Fetch products based on collection theme/category
      const { data } = await axios.get('/products/1');

      // For demo, show first 12 products
      setProducts(data.slice(0, 12));
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const getDefaultCollection = () => {
    const collections = {
      'summer-essentials': {
        name: 'Summer Essentials',
        description: 'Beat the heat with our curated summer collection. From swimwear to sunglasses, we have everything you need for the perfect summer.',
        imageUrl: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=1600',
        theme: 'summer'
      },
      'work-from-home': {
        name: 'Work From Home',
        description: 'Create the perfect home office setup with our selection of ergonomic furniture, tech gadgets, and productivity tools.',
        imageUrl: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=1600',
        theme: 'office'
      },
      'tech-deals': {
        name: 'Tech Deals',
        description: 'Discover the latest technology at unbeatable prices. From smartphones to smart home devices, upgrade your tech game today.',
        imageUrl: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1600',
        theme: 'tech'
      },
      'fitness-wellness': {
        name: 'Fitness & Wellness',
        description: 'Achieve your health goals with our comprehensive collection of fitness equipment, supplements, and wellness products.',
        imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1600',
        theme: 'fitness'
      }
    };

    return collections[slug] || collections['summer-essentials'];
  };

  const sortProducts = (products) => {
    switch (sortBy) {
      case 'price-low':
        return [...products].sort((a, b) => a.price - b.price);
      case 'price-high':
        return [...products].sort((a, b) => b.price - a.price);
      case 'name':
        return [...products].sort((a, b) => a.name.localeCompare(b.name));
      case 'newest':
        return [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      default:
        return products;
    }
  };

  const themeColors = {
    summer: 'from-yellow-400 to-orange-500',
    office: 'from-blue-400 to-indigo-500',
    tech: 'from-purple-400 to-pink-500',
    fitness: 'from-green-400 to-teal-500',
    default: 'from-gray-400 to-gray-600'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl mb-8"></div>
            <SkeletonProductGrid count={8} />
          </div>
        </div>
      </div>
    );
  }

  const sortedProducts = sortProducts(products);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Collection Banner */}
      <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
        <img
          src={collection?.imageUrl || 'https://via.placeholder.com/1600x400'}
          alt={collection?.name}
          className="w-full h-full object-cover"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${themeColors[collection?.theme || 'default']} opacity-60`}></div>

        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white px-4"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              {collection?.name}
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto opacity-90">
              {collection?.description}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center gap-2 text-sm">
          <button
            onClick={() => navigate('/')}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center gap-1"
          >
            <Home className="h-4 w-4" />
            Home
          </button>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <button
            onClick={() => navigate('/collections')}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Collections
          </button>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <span className="text-gray-900 dark:text-gray-100 font-medium">
            {collection?.name}
          </span>
        </nav>
      </div>

      {/* Toolbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            <span className="text-gray-600 dark:text-gray-400">
              {products.length} Products in this collection
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white dark:bg-gray-600 shadow-sm' : ''}`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-white dark:bg-gray-600 shadow-sm' : ''}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid/List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {sortedProducts.length > 0 ? (
          <div className={viewMode === 'grid'
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-4"
          }>
            {sortedProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <ProductCard p={product} viewMode={viewMode} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No products in this collection yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Check back soon for new additions!
            </p>
            <button
              onClick={() => navigate('/shop')}
              className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-full font-semibold"
            >
              Browse All Products
            </button>
          </div>
        )}
      </div>

      {/* Related Collections */}
      <div className="bg-white dark:bg-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Explore Other Collections
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Summer Essentials', 'Work From Home', 'Tech Deals', 'Fitness & Wellness']
              .filter(name => name !== collection?.name)
              .slice(0, 3)
              .map((name, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  onClick={() => navigate(`/collections/${name.toLowerCase().replace(/[&\s]/g, '-')}`)}
                  className="p-6 bg-gradient-to-br from-primary/10 to-purple-100 dark:from-primary/20 dark:to-purple-900/20 rounded-xl hover:shadow-lg transition-all text-center"
                >
                  <Package className="h-8 w-8 text-primary mx-auto mb-2" />
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {name}
                  </span>
                </motion.button>
              ))}
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              onClick={() => navigate('/collections')}
              className="p-6 bg-gray-100 dark:bg-gray-700 rounded-xl hover:shadow-lg transition-all text-center"
            >
              <Grid className="h-8 w-8 text-gray-600 dark:text-gray-400 mx-auto mb-2" />
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                All Collections
              </span>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}