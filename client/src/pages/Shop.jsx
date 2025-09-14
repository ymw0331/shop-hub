import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  Filter, X, ChevronDown, Grid, List, Search,
  SlidersHorizontal, Package, Tag, DollarSign
} from 'lucide-react';
import PageContainer from '../components/layout/PageContainer';
import PageHeader from '../components/layout/PageHeader';
import ProductCard from '../components/cards/ProductCard';
import Checkbox from '../components/ui/Checkbox';
import Radio from '../components/ui/Radio';
import Button from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import Skeleton from '../components/ui/Skeleton';
import { cn } from '../lib/utils';
import { prices } from '../prices';
import usePageTitle from '../hooks/usePageTitle';

export default function Shop() {
  usePageTitle('Shop');
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');

  // Load products and categories
  useEffect(() => {
    loadInitialData();
  }, []);

  // Filter products when filters change
  useEffect(() => {
    // Skip initial render when products haven't loaded yet
    if (!products.length) return;
    
    if (!checked.length && !radio.length) {
      setFilteredProducts(products);
    } else {
      loadFilteredProducts();
    }
  }, [checked, radio, products]);

  // Sort products when sort option changes
  useEffect(() => {
    // Only sort if we have products to sort
    if (filteredProducts.length > 0) {
      sortProducts();
    }
  }, [sortBy]);

  // Search products locally
  useEffect(() => {
    // Skip if products haven't loaded yet
    if (!products.length) return;
    
    if (searchTerm) {
      const baseProducts = checked.length || radio.length ? filteredProducts : products;
      const searched = baseProducts.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(searched);
    } else if (!checked.length && !radio.length) {
      setFilteredProducts(products);
    } else {
      loadFilteredProducts();
    }
  }, [searchTerm, products, checked.length, radio.length]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        axios.get("/products"),
        axios.get("/categories")
      ]);
      setProducts(productsRes.data);
      setFilteredProducts(productsRes.data);
      setCategories(categoriesRes.data.sort((a, b) => 
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      ));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadFilteredProducts = async () => {
    try {
      const { data } = await axios.post("/products/search", {
        checked,
        radio
      });
      setFilteredProducts(data.products || []);
    } catch (error) {
      console.error(error);
    }
  };

  const sortProducts = () => {
    let sorted = [...filteredProducts];
    switch (sortBy) {
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
    setFilteredProducts(sorted);
  };

  const handleChecked = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id);
    }
    setChecked(all);
  };

  const clearFilters = () => {
    setChecked([]);
    setRadio([]);
    setSearchTerm('');
    setFilteredProducts(products);
  };

  // Filter Sidebar Component
  const FilterSidebar = () => (
    <Card className={cn(
      "p-6 h-fit sticky top-24",
      "lg:block",
      filterOpen ? "block" : "hidden lg:block"
    )}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-gray-100">
          <SlidersHorizontal className="h-5 w-5" />
          Filters
        </h3>
        <button
          onClick={() => setFilterOpen(false)}
          className="lg:hidden text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Search within results */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>

      {/* Categories Filter */}
      <div className="mb-6">
        <h4 className="font-medium mb-3 flex items-center gap-2 text-gray-900 dark:text-gray-100">
          <Tag className="h-4 w-4" />
          Categories
        </h4>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {categories?.map(c => (
            <Checkbox
              key={c.id}
              label={c.name}
              checked={checked.includes(c.id)}
              onChange={(e) => handleChecked(e.target.checked, c.id)}
            />
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div className="mb-6">
        <h4 className="font-medium mb-3 flex items-center gap-2 text-gray-900 dark:text-gray-100">
          <DollarSign className="h-4 w-4" />
          Price Range
        </h4>
        <div className="space-y-2">
          {prices?.map(p => (
            <Radio
              key={p.id}
              name="price"
              label={p.name}
              value={p.array}
              checked={radio === p.array}
              onChange={(e) => setRadio(p.array)}
            />
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      <Button
        variant="outline"
        className="w-full"
        onClick={clearFilters}
      >
        Clear All Filters
      </Button>
    </Card>
  );

  return (
    <PageContainer>
      <PageHeader
        title="Shop"
        subtitle={`Discover ${products.length} amazing products`}
      />

      <div className="flex gap-6">
        {/* Mobile Filter Button */}
        <button
          onClick={() => setFilterOpen(!filterOpen)}
          className="lg:hidden fixed bottom-4 right-4 z-50 bg-indigo-600 dark:bg-indigo-500 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
        >
          <Filter className="h-6 w-6" />
        </button>

        {/* Filter Sidebar */}
        <aside className={cn(
          "lg:w-64 shrink-0",
          filterOpen ? "fixed inset-0 z-40 bg-white dark:bg-gray-900 lg:relative lg:bg-transparent" : ""
        )}>
          <FilterSidebar />
        </aside>

        {/* Products Section */}
        <main className="flex-1">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-600 dark:text-gray-400">
                {filteredProducts.length} Products found
              </span>
            </div>

            <div className="flex items-center gap-4">
              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 border border-gray-300 dark:border-gray-600 rounded-lg p-1 bg-white dark:bg-gray-800">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    "p-2 rounded",
                    viewMode === 'grid' ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-400" : "text-gray-500 dark:text-gray-400"
                  )}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    "p-2 rounded",
                    viewMode === 'list' ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-400" : "text-gray-500 dark:text-gray-400"
                  )}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-gray-100"
                >
                  <option value="newest">Newest First</option>
                  <option value="popular">Most Popular</option>
                  <option value="priceLow">Price: Low to High</option>
                  <option value="priceHigh">Price: High to Low</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>

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
                {filteredProducts?.map((p, index) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <ProductCard p={p} viewMode={viewMode} />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}

          {/* No Products Found */}
          {!loading && filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No products found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Try adjusting your filters or search terms
              </p>
              <Button onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          )}
        </main>
      </div>
    </PageContainer>
  );
}