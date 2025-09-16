import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Instagram, Heart, MessageCircle, Share2, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

export default function SocialFeed() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadSocialFeed();
  }, []);

  const loadSocialFeed = async () => {
    try {
      setLoading(true);
      // Use regular products endpoint as social feed for now
      const { data } = await axios.get('/products/1');

      // Transform products to social feed format
      const socialProducts = data.map(product => ({
        ...product,
        likes: Math.floor(Math.random() * 1000) + 100,
        comments: Math.floor(Math.random() * 50) + 5,
        shares: Math.floor(Math.random() * 100) + 10,
        username: `@${['styleicon', 'trendlover', 'fashionista', 'techguru', 'homestyle'][Math.floor(Math.random() * 5)]}`,
        isVerified: Math.random() > 0.5
      }));

      setProducts(socialProducts.slice(0, 12));
    } catch (error) {
      console.error('Error loading social feed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-b from-pink-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mx-auto mb-8"></div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!products.length) {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-to-b from-pink-50 to-white dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Instagram className="h-8 w-8 text-pink-500" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
              Shop the Feed
            </h2>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Get inspired by what's trending on social
          </p>
        </motion.div>

        {/* Instagram-style Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 md:gap-2">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="relative group cursor-pointer aspect-square overflow-hidden rounded-lg"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => navigate(`/product/${product.slug}`)}
            >
              {/* Product Image */}
              <LazyLoadImage
                src={product.photoPath ? `/api/product/photo/${product.id}` : 'https://via.placeholder.com/400'}
                alt={product.name}
                effect="blur"
                className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
              />

              {/* Gradient Overlay on Hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Social Proof Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
                className="absolute inset-0 flex flex-col justify-between p-4"
              >
                {/* Top Section - Username */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-gray-900">
                        {product.username[1].toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-white text-sm font-semibold flex items-center gap-1">
                        {product.username}
                        {product.isVerified && (
                          <svg className="w-3 h-3 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </p>
                    </div>
                  </div>
                  <ShoppingBag className="h-5 w-5 text-white" />
                </div>

                {/* Bottom Section - Product Info & Engagement */}
                <div>
                  <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-white font-bold text-lg mb-2">
                    ${product.price}
                  </p>

                  {/* Engagement Stats */}
                  <div className="flex items-center gap-4 text-white">
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      <span className="text-xs">{product.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-xs">{product.comments}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Share2 className="h-4 w-4" />
                      <span className="text-xs">{product.shares}</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Quick Shop Button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: hoveredIndex === index ? 1 : 0, y: hoveredIndex === index ? 0 : 20 }}
                className="absolute bottom-4 left-4 right-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 py-2 px-4 rounded-full text-sm font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/product/${product.slug}`);
                }}
              >
                Quick Shop
              </motion.button>

              {/* Trending Badge */}
              {index < 3 && (
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full text-xs font-bold">
                    TRENDING
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Follow CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-4 p-6 bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/20 dark:to-purple-900/20 rounded-2xl">
            <Instagram className="h-10 w-10 text-pink-500" />
            <div className="text-left">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Follow us on Instagram
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                @shophub for daily style inspiration
              </p>
            </div>
            <button className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-semibold hover:shadow-lg transition-shadow">
              Follow
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}