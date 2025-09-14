/* eslint-disable jsx-a11y/alt-text */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/auth';
import { PageContainer, PageHeader } from '../../components/ui/PageContainer';
import AdminMenu from '../../components/nav/AdminMenu';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import axios from 'axios';
import { Link } from "react-router-dom";
import moment from 'moment';
import { Package, Search, Edit, Eye, Calendar, DollarSign, Hash } from 'lucide-react';
import usePageTitle from '../../hooks/usePageTitle';

export default function AdminProducts ()
{
  usePageTitle('Manage Products');
  //context
  const [ auth, setAuth ] = useAuth();

  //state
  const [ products, setProducts ] = useState( [] );
  const [ searchTerm, setSearchTerm ] = useState( '' );
  const [ filteredProducts, setFilteredProducts ] = useState( [] );

  useEffect( () =>
  {
    loadProducts();
  }, [] );

  const loadProducts = async () =>
  {
    try
    {
      const { data } = await axios.get( "/products" );
      setProducts( data );
      setFilteredProducts( data );
    } catch ( error )
    {
      console.log( error );
    }
  };

  // Search functionality
  useEffect(() => {
    if (!searchTerm) {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  return (
    <PageContainer>
      <PageHeader
        title={`Hello ${auth?.user?.name}`}
        subtitle="Product Management"
        gradient="from-indigo-500 to-purple-600"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 flex justify-center"
        >
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3">
            <div className="flex items-center space-x-2 text-white">
              <Package className="h-5 w-5" />
              <span className="text-lg font-medium">Total: {products.length} Products</span>
            </div>
          </div>
        </motion.div>
      </PageHeader>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <AdminMenu />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="space-y-6"
            >
              {/* Search Bar */}
              <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-xl">
                <CardContent className="p-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
                    <Input
                      placeholder="Search products by name or description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-white/80 dark:bg-gray-800/80"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Products List */}
              <AnimatePresence mode="wait">
                {filteredProducts.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-xl">
                      <CardContent className="p-12 text-center">
                        <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
                          {searchTerm ? 'No products found' : 'No products yet'}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                          {searchTerm 
                            ? 'Try adjusting your search terms' 
                            : 'Create your first product to get started'
                          }
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    {filteredProducts.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Link
                          to={`/dashboard/admin/product/update/${product?.slug}`}
                          className="block"
                        >
                          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] group">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                              {/* Product Image */}
                              <div className="md:col-span-1">
                                <div className="relative h-48 md:h-full overflow-hidden rounded-l-lg">
                                  <img
                                    src={`${process.env.REACT_APP_API}/product/photo/${product?.id}`}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent group-hover:from-black/30 transition-all duration-300" />
                                </div>
                              </div>

                              {/* Product Details */}
                              <div className="md:col-span-2 p-6">
                                <div className="h-full flex flex-col justify-between">
                                  <div>
                                    <div className="flex items-start justify-between mb-4">
                                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
                                        {product?.name}
                                      </h3>
                                      <div className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 text-xs font-medium px-2 py-1 rounded-full">
                                        <Edit className="inline h-3 w-3 mr-1" />
                                        Edit
                                      </div>
                                    </div>
                                    
                                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                                      {product?.description.substring(0, 150)}
                                      {product?.description.length > 150 && "..."}
                                    </p>

                                    {/* Product Stats */}
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                      {product?.price && (
                                        <div className="flex items-center space-x-2 text-green-600">
                                          <DollarSign className="h-4 w-4" />
                                          <span className="font-semibold">${product.price}</span>
                                        </div>
                                      )}
                                      {product?.quantity !== undefined && (
                                        <div className="flex items-center space-x-2 text-blue-600">
                                          <Hash className="h-4 w-4" />
                                          <span className="font-medium">Stock: {product.quantity}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {/* Footer */}
                                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 pt-4 border-t dark:border-gray-700">
                                    <div className="flex items-center space-x-2">
                                      <Calendar className="h-4 w-4" />
                                      <span>
                                        Created {moment(product.createdAt).format("MMM DD, YYYY")}
                                      </span>
                                    </div>
                                    <div className="text-indigo-600 dark:text-indigo-400 font-medium group-hover:text-indigo-800 dark:group-hover:text-indigo-300">
                                      Click to edit →
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Card>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                )}
              </AnimatePresence>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="flex justify-center pt-6"
              >
                <Link to="/dashboard/admin/product">
                  <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 px-8 py-3 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200">
                    <Package className="mr-2 h-5 w-5" />
                    Create New Product
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};