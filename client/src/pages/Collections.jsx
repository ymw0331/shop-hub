import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Package, ArrowRight, Grid3x3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import usePageTitle from '../hooks/usePageTitle';

export default function Collections() {
  usePageTitle('Collections');
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/collections');

      if (!data || data.length === 0) {
        setCollections(getDefaultCollections());
      } else {
        setCollections(data);
      }
    } catch (error) {
      console.error('Error loading collections:', error);
      setCollections(getDefaultCollections());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultCollections = () => [
    {
      id: '1',
      name: 'Summer Essentials',
      slug: 'summer-essentials',
      description: 'Beat the heat with our curated summer collection',
      imageUrl: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800',
      theme: 'summer',
      productCount: 24,
      active: true
    },
    {
      id: '2',
      name: 'Work From Home',
      slug: 'work-from-home',
      description: 'Everything you need for the perfect home office',
      imageUrl: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800',
      theme: 'office',
      productCount: 18,
      active: true
    },
    {
      id: '3',
      name: 'Tech Deals',
      slug: 'tech-deals',
      description: 'Latest gadgets and electronics at amazing prices',
      imageUrl: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800',
      theme: 'tech',
      productCount: 32,
      active: true
    },
    {
      id: '4',
      name: 'Fitness & Wellness',
      slug: 'fitness-wellness',
      description: 'Stay healthy and active with our fitness collection',
      imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800',
      theme: 'fitness',
      productCount: 27,
      active: true
    },
    {
      id: '5',
      name: 'Home Decor',
      slug: 'home-decor',
      description: 'Transform your space with stylish home accessories',
      imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
      theme: 'home',
      productCount: 35,
      active: true
    },
    {
      id: '6',
      name: 'Fashion Forward',
      slug: 'fashion-forward',
      description: 'Trending styles for the modern fashionista',
      imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800',
      theme: 'fashion',
      productCount: 42,
      active: true
    }
  ];

  const themeColors = {
    summer: 'from-yellow-400 to-orange-500',
    office: 'from-blue-400 to-indigo-500',
    tech: 'from-purple-400 to-pink-500',
    fitness: 'from-green-400 to-teal-500',
    home: 'from-amber-400 to-brown-500',
    fashion: 'from-pink-400 to-rose-500',
    default: 'from-gray-400 to-gray-600'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-80 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Package className="h-10 w-10 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100">
                Shop by Collection
              </h1>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Discover our carefully curated collections designed to match your lifestyle and needs
            </p>
          </motion.div>
        </div>
      </div>

      {/* Collections Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.filter(c => c.active).map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group cursor-pointer"
              onClick={() => navigate(`/collections/${collection.slug}`)}
            >
              <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                {/* Collection Image */}
                <div className="aspect-[4/3] relative">
                  <img
                    src={collection.imageUrl || 'https://via.placeholder.com/400x300'}
                    alt={collection.name}
                    className="w-full h-full object-cover"
                  />

                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t ${themeColors[collection.theme || 'default']} opacity-40 group-hover:opacity-50 transition-opacity`}></div>

                  {/* Collection Info Overlay */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                    {/* Product Count Badge */}
                    <div className="absolute top-4 right-4">
                      <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
                        {collection.productCount || 0} Items
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold mb-2">{collection.name}</h3>
                    <p className="text-sm opacity-90 mb-4">
                      {collection.description}
                    </p>

                    {/* View Collection Button */}
                    <div className="flex items-center gap-2 group-hover:gap-3 transition-all">
                      <span className="text-white font-semibold">Shop Collection</span>
                      <ArrowRight className="h-5 w-5" />
                    </div>
                  </div>
                </div>

                {/* New/Sale Badges */}
                {index === 0 && (
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-red-500 text-white rounded-full text-xs font-bold">
                      NEW
                    </span>
                  </div>
                )}
                {index === 2 && (
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-green-500 text-white rounded-full text-xs font-bold">
                      SALE
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Create Custom Collection CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex flex-col items-center p-8 bg-gradient-to-r from-primary/10 to-purple-100 dark:from-primary/20 dark:to-purple-900/20 rounded-2xl">
            <Grid3x3 className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Can't find what you're looking for?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Browse our full catalog to discover more amazing products
            </p>
            <button
              onClick={() => navigate('/shop')}
              className="px-8 py-3 bg-primary hover:bg-primary/90 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              Browse All Products
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}