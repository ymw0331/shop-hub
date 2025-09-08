import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Grid3X3, Tag, Package, ShoppingBag, Sparkles,
  Shirt, Monitor, Home, Heart, Gift, Coffee,
  Book, Gamepad2, Music, Camera
} from 'lucide-react';
import useCategory from '../hooks/useCategory';
import PageContainer from '../components/layout/PageContainer';
import PageHeader from '../components/layout/PageHeader';
import { Card } from '../components/ui/Card';
import { cn } from '../lib/utils';
import usePageTitle from '../hooks/usePageTitle';

// Category icons mapping
const categoryIcons = {
  'electronics': Monitor,
  'clothing': Shirt,
  'home': Home,
  'beauty': Heart,
  'sports': Gamepad2,
  'books': Book,
  'music': Music,
  'camera': Camera,
  'food': Coffee,
  'gifts': Gift,
  'default': ShoppingBag
};

// Category colors for gradients
const categoryColors = [
  'from-purple-500 to-pink-500',
  'from-blue-500 to-cyan-500',
  'from-green-500 to-emerald-500',
  'from-orange-500 to-red-500',
  'from-indigo-500 to-purple-500',
  'from-pink-500 to-rose-500',
  'from-teal-500 to-green-500',
  'from-yellow-500 to-orange-500',
];

export default function CategoriesList() {
  usePageTitle('Categories');
  const categories = useCategory();
  const [categoryCounts, setCategoryCounts] = useState({});
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    fetchCategoryCounts();
  }, [categories]);

  const fetchCategoryCounts = async () => {
    try {
      // Fetch all products to count by category
      const { data } = await axios.get('/products');
      
      // Count products by category
      const counts = {};
      let total = 0;
      
      data.forEach(product => {
        if (product.category) {
          const categoryId = product.category._id;
          counts[categoryId] = (counts[categoryId] || 0) + 1;
          total++;
        }
      });
      
      setCategoryCounts(counts);
      setTotalProducts(total);
    } catch (error) {
      console.error('Error fetching product counts:', error);
    }
  };

  const getIcon = (categoryName) => {
    const name = categoryName.toLowerCase();
    for (const [key, Icon] of Object.entries(categoryIcons)) {
      if (name.includes(key)) return Icon;
    }
    return categoryIcons.default;
  };

  const getColor = (index) => {
    return categoryColors[index % categoryColors.length];
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Shop by Category"
        subtitle={`Explore ${categories.length} categories`}
      >
        <div className="flex items-center gap-2 mt-4">
          <Sparkles className="h-5 w-5 text-white/80" />
          <span className="text-white/80">Find exactly what you're looking for</span>
        </div>
      </PageHeader>

      {/* Categories Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {categories.map((category, index) => {
          const Icon = getIcon(category.name);
          const gradientColor = getColor(index);
          
          return (
            <motion.div
              key={category._id}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link to={`/category/${category.slug}`}>
                <Card className="relative overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300">
                  {/* Gradient Background */}
                  <div className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-90 group-hover:opacity-100 transition-opacity",
                    gradientColor
                  )} />
                  
                  {/* Pattern Overlay */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }} />
                  </div>
                  
                  {/* Content */}
                  <div className="relative z-10 p-8 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl group-hover:bg-white/30 transition-colors">
                        <Icon className="h-8 w-8" />
                      </div>
                      {/* Product Count Badge */}
                      <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                        {categoryCounts[category._id] || 0} items
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-2 group-hover:translate-x-1 transition-transform">
                      {category.name}
                    </h3>
                    
                    <p className="text-white/80 text-sm mb-4">
                      Discover amazing {category.name.toLowerCase()} products
                    </p>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <span className="group-hover:translate-x-2 transition-transform">
                        Browse collection
                      </span>
                      <Tag className="h-4 w-4" />
                    </div>
                  </div>
                  
                  {/* Hover Effect - Shine */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                  </div>
                </Card>
              </Link>
            </motion.div>
          );
        })}
        
        {/* All Products Card */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Link to="/shop">
            <Card className="relative overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300 h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-700 dark:to-gray-800" />
              
              {/* Grid Pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
                }} />
              </div>
              
              <div className="relative z-10 p-8 text-white h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl group-hover:bg-white/30 transition-colors">
                      <Grid3X3 className="h-8 w-8" />
                    </div>
                    {/* Total Products Badge */}
                    <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                      {totalProducts} items
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-2">
                    All Products
                  </h3>
                  
                  <p className="text-white/80 text-sm">
                    Browse our entire collection
                  </p>
                </div>
                
                <div className="flex items-center gap-2 text-sm mt-4">
                  <span className="group-hover:translate-x-2 transition-transform">
                    View all
                  </span>
                  <Package className="h-4 w-4" />
                </div>
              </div>
            </Card>
          </Link>
        </motion.div>
      </motion.div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-12 text-center"
      >
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Can't find what you're looking for?
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
        >
          <ShoppingBag className="h-5 w-5" />
          Browse All Products
        </Link>
      </motion.div>
    </PageContainer>
  );
}