import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/auth';
import { PageContainer, PageHeader } from '../../components/ui/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import UserMenu from '../../components/nav/UserMenu';
import axios from 'axios';
import { User, Package, ShoppingCart, Clock, TrendingUp, Star } from 'lucide-react';
import Badge from '../../components/ui/Badge';
import usePageTitle from '../../hooks/usePageTitle';

export default function UserDashboard() {
  usePageTitle('My Dashboard');
  // context
  const [auth] = useAuth();
  
  // state
  const [stats, setStats] = useState({
    totalOrders: 0,
    recentOrders: [],
    loading: true
  });

  useEffect(() => {
    if (auth?.token) {
      fetchUserStats();
    }
  }, [auth?.token]);

  const fetchUserStats = async () => {
    try {
      const { data } = await axios.get('/orders');
      setStats({
        totalOrders: data?.length || 0,
        recentOrders: data?.slice(0, 3) || [],
        loading: false
      });
    } catch (err) {
      console.log(err);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  const statsCards = [
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: Package,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Account Status',
      value: auth?.user?.role === 1 ? 'Admin' : 'Customer',
      icon: User,
      color: auth?.user?.role === 1 ? 'from-purple-500 to-purple-600' : 'from-green-500 to-green-600',
      bgColor: auth?.user?.role === 1 ? 'bg-purple-50' : 'bg-green-50',
      iconColor: auth?.user?.role === 1 ? 'text-purple-600' : 'text-green-600',
    },
    {
      title: 'Member Since',
      value: auth?.user?.createdAt ? new Date(auth.user.createdAt).getFullYear() : new Date().getFullYear(),
      icon: Star,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
  ];

  return (
    <PageContainer>
      <PageHeader 
        title={`Welcome back, ${auth?.user?.name || 'User'}!`}
        subtitle="Manage your account and track your orders"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <UserMenu />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {statsCards.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-white dark:bg-gray-900">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
                        </div>
                        <div className={`${stat.bgColor} p-3 rounded-xl`}>
                          <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* User Information Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <Card className="hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-900">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-indigo-600" />
                    Account Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</label>
                      <p className="text-gray-900 dark:text-gray-100 font-medium">{auth?.user?.name}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email Address</label>
                      <p className="text-gray-900 dark:text-gray-100 font-medium">{auth?.user?.email}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Account Type</label>
                      <Badge variant="success" size="sm">Regular User</Badge>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Member Since</label>
                      <p className="text-gray-900 dark:text-gray-100 font-medium">
                        {auth?.user?.createdAt ? 
                          new Date(auth.user.createdAt).toLocaleDateString() : 
                          'Welcome!'
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Orders */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <Card className="hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-900">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-indigo-600" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {stats.loading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                  ) : stats.recentOrders.length > 0 ? (
                    <div className="space-y-4">
                      {stats.recentOrders.map((order, index) => (
                        <div key={order._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-full">
                              <Package className="w-4 h-4 text-indigo-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-gray-100">Order #{index + 1}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{order.products?.length} items</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge 
                              variant={order.status === 'delivered' ? 'success' : 'primary'}
                              size="sm"
                            >
                              {order.status || 'Processing'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400 mb-2">No orders yet</p>
                      <p className="text-sm text-gray-400 dark:text-gray-500">Start shopping to see your orders here!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.6 }}
            >
              <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="w-6 h-6" />
                    <h3 className="text-xl font-bold">Ready to Shop?</h3>
                  </div>
                  <p className="text-white/90 mb-6">
                    Explore our latest products and exclusive deals. Find everything you need in one place.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 px-6 py-3 rounded-lg font-medium transition-all duration-200 border border-white/20">
                      Browse Products
                    </button>
                    <button className="bg-white text-indigo-600 hover:bg-gray-50 px-6 py-3 rounded-lg font-medium transition-all duration-200">
                      View Orders
                    </button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};