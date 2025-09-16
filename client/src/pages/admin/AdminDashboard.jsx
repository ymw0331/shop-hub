import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../../context/auth';
import PageContainer from '../../components/layout/PageContainer';
import PageHeader from '../../components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import moment from 'moment';
import {
  Users,
  Package,
  ShoppingCart,
  TrendingUp,
  DollarSign,
  Eye,
  BarChart3,
  Activity,
  Calendar,
  Settings,
  Bell,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Filter
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import usePageTitle from '../../hooks/usePageTitle';


// Admin navigation items
const adminNavItems = [
  { to: "/dashboard/admin/category", label: "Create Category", icon: Plus },
  { to: "/dashboard/admin/product", label: "Create Product", icon: Package },
  { to: "/dashboard/admin/products", label: "All Products", icon: Eye },
  { to: "/dashboard/admin/orders", label: "Manage Orders", icon: ShoppingCart }
];

export default function AdminDashboard() {
  usePageTitle('Admin Dashboard');
  const [auth] = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    recentOrders: []
  });

  // Fetch real data from backend
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch all data in parallel
      const [ordersRes, , productsCountRes] = await Promise.all([
        axios.get('/admin/orders'),
        axios.get('/products'),
        axios.get('/products/count')
      ]);

      const orders = ordersRes.data || [];
      const productsCount = productsCountRes.data || 0;

      // Calculate total revenue from orders
      const totalRevenue = orders.reduce((sum, order) => {
        // Parse amount as float since Braintree returns it as a string
        const amount = parseFloat(order.payment?.transaction?.amount) || 0;
        return sum + amount;
      }, 0);

      // Get unique users from orders
      const uniqueUsers = new Set(orders.map(order => order.buyer?.id).filter(Boolean));

      // Get recent 5 orders for activities
      const recentOrders = orders.slice(0, 5);

      setStats({
        totalRevenue,
        totalOrders: orders.length,
        totalProducts: productsCount,
        totalUsers: uniqueUsers.size,
        recentOrders
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Prepare stats data for display
  const statsData = [
    {
      title: 'Total Revenue',
      value: `$${(typeof stats.totalRevenue === 'number' ? stats.totalRevenue : 0).toFixed(2)}`,
      change: 'Live data',
      changeType: 'neutral',
      icon: DollarSign,
      description: 'from all orders'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders.toString(),
      change: 'Live data',
      changeType: 'neutral',
      icon: ShoppingCart,
      description: 'total orders placed'
    },
    {
      title: 'Total Products',
      value: stats.totalProducts.toString(),
      change: 'Live data',
      changeType: 'neutral',
      icon: Package,
      description: 'products in catalog'
    },
    {
      title: 'Unique Customers',
      value: stats.totalUsers.toString(),
      change: 'Live data',
      changeType: 'neutral',
      icon: Users,
      description: 'customers with orders'
    }
  ];

  // Convert real orders to activities
  const recentActivities = stats.recentOrders.map((order, index) => ({
    id: order.id || index,
    type: 'order',
    message: `Order from ${order.buyer?.name || 'Guest'}`,
    time: moment(order.createdAt).fromNow(),
    status: order.status || 'Not processed',
    amount: parseFloat(order.payment?.transaction?.amount) || 0
  }));

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="text-gray-500 dark:text-gray-400">Loading dashboard...</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* Header */}
      <PageHeader 
        title={`Welcome back, ${auth?.user?.name || 'Admin'}`}
        subtitle="Here's what's happening with your store today."
      />

      {/* Main Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-1"
        >
          {/* Admin Navigation */}
          <Card className="bg-white dark:bg-gray-900 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 mb-6">
            <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-xl">
              <CardTitle className="text-white flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Admin Tools
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <nav className="space-y-1">
                {adminNavItems.map((item, index) => (
                  <motion.div
                    key={item.to}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <NavLink
                      to={item.to}
                      className={({ isActive }) => `
                        flex items-center gap-3 px-6 py-4 text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/20 dark:hover:to-purple-900/20 hover:text-indigo-700 dark:hover:text-indigo-400 transition-all duration-200 group
                        ${isActive ? 'bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 text-indigo-700 dark:text-indigo-400 border-r-2 border-indigo-500' : ''}
                      `}
                    >
                      <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                      <span className="font-medium">{item.label}</span>
                    </NavLink>
                  </motion.div>
                ))}
              </nav>
            </CardContent>
          </Card>

          {/* Admin Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-gray-800 dark:text-gray-100">Admin Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center space-y-2">
                  <p className="font-semibold text-gray-800 dark:text-gray-100">{auth.user?.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{auth.user?.email}</p>
                  <Badge variant="primary" className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                    Administrator
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Stats Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {statsData.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="group"
              >
                <Card className="bg-white dark:bg-gray-900 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <CardContent className="p-6 relative">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{stat.title}</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{stat.value}</p>
                        <div className="flex items-center gap-1">
                          {stat.changeType === 'positive' ? (
                            <ArrowUpRight className="w-4 h-4 text-green-500" />
                          ) : (
                            <ArrowDownRight className="w-4 h-4 text-red-500" />
                          )}
                          <span className={`text-sm font-medium ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                            {stat.change}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">{stat.description}</span>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 rounded-lg">
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Charts Placeholder and Activity Feed Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Charts Placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="bg-white dark:bg-gray-900 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-indigo-600" />
                    Sales Analytics
                  </CardTitle>
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </button>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <TrendingUp className="w-12 h-12 text-indigo-300 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">Chart component will be integrated here</p>
                      <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Revenue trends and analytics</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="bg-white dark:bg-gray-900 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-indigo-600" />
                    Recent Activity
                  </CardTitle>
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <Bell className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </button>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-1 max-h-64 overflow-y-auto">
                    {recentActivities.length === 0 ? (
                      <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                        <Activity className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p className="text-sm">No recent orders yet</p>
                      </div>
                    ) : (
                    recentActivities.map((activity, index) => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b dark:border-gray-700 last:border-b-0"
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            activity.status === 'new' ? 'bg-green-500' :
                            activity.status === 'warning' ? 'bg-yellow-500' :
                            activity.status === 'shipped' ? 'bg-blue-500' :
                            'bg-gray-500'
                          }`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                              {activity.message}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Calendar className="w-3 h-3 text-gray-400" />
                              <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                              {activity.amount > 0 && (
                                <span className="text-xs font-medium text-indigo-600">
                                  ${(typeof activity.amount === 'number' ? activity.amount : 0).toFixed(2)}
                                </span>
                              )}
                              <Badge 
                                variant={activity.status === 'Not processed' ? 'warning' : 
                                        activity.status === 'Processing' ? 'primary' :
                                        activity.status === 'Shipped' ? 'default' :
                                        activity.status === 'Delivered' ? 'success' :
                                        activity.status === 'Cancelled' ? 'danger' : 'default'}
                                size="sm"
                              >
                                {activity.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-indigo-100 dark:border-indigo-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-indigo-900 dark:text-indigo-100">
                  <Plus className="w-5 h-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Add Product', to: '/dashboard/admin/product', icon: Package, color: 'from-blue-500 to-blue-600' },
                    { label: 'New Category', to: '/dashboard/admin/category', icon: Plus, color: 'from-green-500 to-green-600' },
                    { label: 'View Orders', to: '/dashboard/admin/orders', icon: ShoppingCart, color: 'from-purple-500 to-purple-600' },
                    { label: 'Analytics', to: '#', icon: BarChart3, color: 'from-orange-500 to-orange-600' }
                  ].map((action, index) => (
                    <motion.div
                      key={action.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <NavLink
                        to={action.to}
                        className="block p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-all duration-200 group"
                      >
                        <div className={`w-10 h-10 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200`}>
                          <action.icon className="w-5 h-5 text-white" />
                        </div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{action.label}</p>
                      </NavLink>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </PageContainer>
  );
};