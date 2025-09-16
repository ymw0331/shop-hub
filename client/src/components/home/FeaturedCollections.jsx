import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Package, ArrowRight, Star, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';

export default function FeaturedCollections() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/collections?limit=4');

      // If no collections exist yet, create default ones
      if (!data || data.length === 0) {
        setCollections(getDefaultCollections());
      } else {
        setCollections(data);
      }
    } catch (error) {
      console.error('Error loading collections:', error);
      // Use default collections as fallback
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
      products: []
    },
    {
      id: '2',
      name: 'Work From Home',
      slug: 'work-from-home',
      description: 'Everything you need for the perfect home office',
      imageUrl: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800',
      theme: 'office',
      productCount: 18,
      products: []
    },
    {
      id: '3',
      name: 'Tech Deals',
      slug: 'tech-deals',
      description: 'Latest gadgets and electronics at amazing prices',
      imageUrl: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800',
      theme: 'tech',
      productCount: 32,
      products: []
    },
    {
      id: '4',
      name: 'Fitness & Wellness',
      slug: 'fitness-wellness',
      description: 'Stay healthy and active with our fitness collection',
      imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800',
      theme: 'fitness',
      productCount: 27,
      products: []
    }
  ];

  const themeColors = {
    summer: 'from-yellow-400 to-orange-500',
    office: 'from-blue-400 to-indigo-500',
    tech: 'from-purple-400 to-pink-500',
    fitness: 'from-green-400 to-teal-500',
    default: 'from-gray-400 to-gray-600'
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mx-auto mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Package className="h-8 w-8 text-indigo-500" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
              Featured Collections
            </h2>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Handpicked themes for every lifestyle and season
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group cursor-pointer"
              onClick={() => navigate(`/collections/${collection.slug}`)}
            >
              <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                {/* Collection Image */}
                <div className="aspect-[4/5] relative">
                  <img
                    src={collection.imageUrl || 'https://via.placeholder.com/400x500'}
                    alt={collection.name}
                    className="w-full h-full object-cover"
                  />

                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t ${themeColors[collection.theme || 'default']} opacity-60 group-hover:opacity-70 transition-opacity`}></div>

                  {/* Collection Info */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
                    <div>
                      {/* Badge */}
                      <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold">
                        {collection.productCount || 0} Items
                      </span>
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold mb-2">{collection.name}</h3>
                      <p className="text-sm opacity-90 mb-4 line-clamp-2">
                        {collection.description}
                      </p>

                      {/* View Collection Button */}
                      <div className="flex items-center justify-between">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-white hover:bg-white/20"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/collections/${collection.slug}`);
                          }}
                        >
                          Shop Now
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>

                        {/* Rating */}
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">4.{Math.floor(Math.random() * 5) + 5}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* New Badge */}
                  {index === 0 && (
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-red-500 text-white rounded-full text-xs font-bold">
                        NEW
                      </span>
                    </div>
                  )}

                  {/* Limited Time Badge */}
                  {index === 1 && (
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-orange-500 text-white rounded-full text-xs font-bold flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        LIMITED
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Collections CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Button
            onClick={() => navigate('/collections')}
            size="lg"
            variant="outline"
          >
            Explore All Collections
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}