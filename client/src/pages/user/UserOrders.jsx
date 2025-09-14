import { useEffect, useState } from "react";
import { motion } from 'framer-motion';
import { useAuth } from "../../context/auth";
import { PageContainer, PageHeader } from '../../components/ui/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import UserMenu from "../../components/nav/UserMenu";
import Badge from '../../components/ui/Badge';
import axios from "axios";
import moment from "moment";
import { Package, Calendar, CreditCard, User, ShoppingBag, Clock, CheckCircle, XCircle, Truck } from "lucide-react";
import { formatCurrency } from '../../lib/utils';
import usePageTitle from '../../hooks/usePageTitle';

export default function UserOrders() {
  usePageTitle('My Orders');
  // context
  const [auth] = useAuth();
  // state
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  const getOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/orders/${auth.user.id}`);
      setOrders(data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'success';
      case 'shipped':
        return 'primary';
      case 'processing':
        return 'warning';
      case 'cancelled':
        return 'danger';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return CheckCircle;
      case 'shipped':
        return Truck;
      case 'processing':
        return Clock;
      case 'cancelled':
        return XCircle;
      default:
        return Package;
    }
  };

  const ProductCard = ({ product, index }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl"
    >
      <div className="flex-shrink-0">
        <img
          src={product.photoPath ? `${process.env.REACT_APP_API}${product.photoPath}` : '/placeholder.png'}
          alt={product.name}
          className="w-16 h-16 object-cover rounded-lg shadow-md"
          onError={(e) => {
            e.target.src = '/placeholder.png';
          }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-900 dark:text-gray-100 truncate">{product.name}</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
          {product.description?.substring(0, 80)}...
        </p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-lg font-bold text-indigo-600">
            {formatCurrency(product.price)}
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            Added {moment(product.createdAt).fromNow()}
          </span>
        </div>
      </div>
    </motion.div>
  );

  return (
    <PageContainer>
      <PageHeader 
        title={`Order History`}
        subtitle={`Track your purchases, ${auth?.user?.name}`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <UserMenu />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-xl h-48"></div>
                  </div>
                ))}
              </div>
            ) : orders.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="text-center py-12 bg-white dark:bg-gray-900">
                  <CardContent>
                    <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-6" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No Orders Yet</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                      You haven't placed any orders yet. Start shopping to see your order history here!
                    </p>
                    <button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-indigo-600 hover:to-purple-700 transition-all duration-200">
                      Start Shopping
                    </button>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <div className="space-y-6">
                {orders.map((order, orderIndex) => {
                  const StatusIcon = getStatusIcon(order.status);
                  
                  return (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: orderIndex * 0.1 }}
                    >
                      <Card className="hover:shadow-xl transition-all duration-300 overflow-hidden bg-white dark:bg-gray-900">
                        {/* Order Header */}
                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-b border-gray-200 dark:border-gray-700">
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <CardTitle className="flex items-center gap-3">
                                <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-lg">
                                  <Package className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div>
                                  <h3 className="text-xl font-semibold">Order #{orderIndex + 1}</h3>
                                  <p className="text-sm text-gray-500 dark:text-gray-400 font-normal">
                                    {order.products?.length || 0} item{(order.products?.length || 0) !== 1 ? 's' : ''}
                                  </p>
                                </div>
                              </CardTitle>
                              <Badge variant={getStatusVariant(order.status)} className="flex items-center gap-1">
                                <StatusIcon className="w-3 h-3" />
                                {order.status || 'Processing'}
                              </Badge>
                            </div>
                          </CardHeader>
                        </div>

                        <CardContent className="p-6">
                          {/* Order Details Grid */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                              <User className="w-5 h-5 text-gray-400" />
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Buyer</p>
                                <p className="font-semibold text-gray-900 dark:text-gray-100">{order.buyer?.name}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                              <Calendar className="w-5 h-5 text-gray-400" />
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Ordered</p>
                                <p className="font-semibold text-gray-900 dark:text-gray-100">
                                  {moment(order.createdAt).format('MMM DD, YYYY')}
                                </p>
                                <p className="text-xs text-gray-400 dark:text-gray-500">
                                  {moment(order.createdAt).fromNow()}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                              <CreditCard className="w-5 h-5 text-gray-400" />
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Payment</p>
                                <div className="flex items-center gap-2">
                                  {order.payment?.success ? (
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                  ) : (
                                    <XCircle className="w-4 h-4 text-red-500" />
                                  )}
                                  <span className={`font-semibold ${order.payment?.success ? 'text-green-600' : 'text-red-600'}`}>
                                    {order.payment?.success ? 'Completed' : 'Failed'}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                              <Package className="w-5 h-5 text-gray-400" />
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Items</p>
                                <p className="font-semibold text-gray-900 dark:text-gray-100">
                                  {order.products?.length || 0} product{(order.products?.length || 0) !== 1 ? 's' : ''}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Products */}
                          <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                              <ShoppingBag className="w-5 h-5 text-indigo-600" />
                              Order Items
                            </h4>
                            <div className="grid gap-4">
                              {order.products?.map((product, productIndex) => (
                                <ProductCard 
                                  key={`${order.id}-${product.id}-${productIndex}`} 
                                  product={product} 
                                  index={productIndex}
                                />
                              ))}
                            </div>
                          </div>

                          {/* Order Actions */}
                          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <button className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                              View Details
                            </button>
                            {order.status?.toLowerCase() === 'delivered' && (
                              <button className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-200">
                                Reorder Items
                              </button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
