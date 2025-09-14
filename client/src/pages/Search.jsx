import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Search as SearchIcon, Package, TrendingUp, Clock, 
  Sparkles, ArrowRight, Filter
} from 'lucide-react';
import { useSearch } from '../context/search';
import PageContainer from '../components/layout/PageContainer';
import PageHeader from '../components/layout/PageHeader';
import ProductCard from '../components/cards/ProductCard';
import Button from '../components/ui/Button';
// import { cn } from '../lib/utils';
import usePageTitle from '../hooks/usePageTitle';

export default function Search() {
  usePageTitle('Search');
  const [values] = useSearch();
  const results = values?.results || [];
  const keyword = values?.keyword || '';

  // Highlight search term in text - currently unused
  // const highlightText = (text, highlight) => {
  //   if (!highlight.trim()) {
  //     return text;
  //   }
  //   const regex = new RegExp(`(${highlight})`, 'gi');
  //   const parts = text.split(regex);
  //   
  //   return parts.map((part, index) =>
  //     regex.test(part) ? (
  //       <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">
  //         {part}
  //       </mark>
  //     ) : (
  //       part
  //     )
  //   );
  // };

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
        title="Search Results"
        subtitle={
          results.length === 0
            ? `No products found for "${keyword}"`
            : `Found ${results.length} ${results.length === 1 ? 'product' : 'products'} for "${keyword}"`
        }
        className="mb-8"
      >
        {results.length > 0 && (
          <div className="flex items-center gap-2 mt-4">
            <Sparkles className="h-5 w-5 text-white/80" />
            <span className="text-white/80">
              Showing the most relevant results
            </span>
          </div>
        )}
      </PageHeader>

      {/* Search Info Bar */}
      {keyword && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-4 mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white dark:bg-gray-800 rounded-lg">
                <SearchIcon className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">You searched for</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">"{keyword}"</p>
              </div>
            </div>
            
            {results.length > 0 && (
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Just now</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  <span>{results.filter(p => p.sold > 5).length} popular items</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Results Grid */}
      {results.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {results.map((product, index) => (
            <motion.div
              key={product.id}
              variants={itemVariants}
              custom={index}
            >
              <div className="relative">
                <ProductCard p={product} />
                {/* Relevance Badge */}
                {index < 3 && (
                  <div className="absolute top-2 left-2 z-10 px-2 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-medium rounded-full">
                    Most Relevant
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-full blur-xl opacity-50" />
            <Package className="relative h-24 w-24 text-gray-300 dark:text-gray-600" />
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            No results found
          </h3>
          
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
            We couldn't find any products matching "{keyword}". 
            Try adjusting your search or browse our categories.
          </p>

          {/* Suggestions */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 max-w-2xl mx-auto mb-8">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Search suggestions:
            </h4>
            <ul className="text-left text-gray-600 dark:text-gray-400 space-y-2 max-w-md mx-auto">
              <li className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-indigo-600" />
                Check your spelling and try again
              </li>
              <li className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-indigo-600" />
                Try using more general terms
              </li>
              <li className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-indigo-600" />
                Browse categories for similar products
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/shop">
              <Button>
                <Package className="h-5 w-5 mr-2" />
                Browse All Products
              </Button>
            </Link>
            <Link to="/categories">
              <Button variant="outline">
                <Filter className="h-5 w-5 mr-2" />
                View Categories
              </Button>
            </Link>
          </div>
        </motion.div>
      )}

      {/* Popular Searches Section */}
      {results.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-16"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Popular searches
          </h3>
          <div className="flex flex-wrap gap-2">
            {['Electronics', 'Clothing', 'Home Decor', 'Sports', 'Books', 'Beauty'].map((term) => (
              <button
                key={term}
                className="px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg hover:from-indigo-100 hover:to-purple-100 dark:hover:from-indigo-900/50 dark:hover:to-purple-900/50 transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Related Categories */}
      {results.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50 rounded-2xl"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Related categories
          </h3>
          <div className="flex flex-wrap gap-3">
            {Array.from(new Set(results.map(p => p.category?.name).filter(Boolean))).map((category) => (
              <Link
                key={category}
                to={`/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
                className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 transition-colors"
              >
                {category}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </PageContainer>
  );
}