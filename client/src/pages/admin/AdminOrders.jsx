import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/auth";
import { PageContainer, PageHeader } from "../../components/ui/PageContainer";
import AdminMenu from "../../components/nav/AdminMenu";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Select from "../../components/ui/Select";
import axios from "axios";
import moment from "moment";
import ProductCardHorizontal from "../../components/cards/ProductCardHorizontal";
import { 
  Package, 
  Calendar, 
  CreditCard, 
  User, 
  ChevronDown, 
  ChevronUp,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  Package2
} from "lucide-react";
import { cn } from "../../lib/utils";
import usePageTitle from '../../hooks/usePageTitle';

export default function AdminOrders ()
{
  usePageTitle('Manage Orders');
  // context
  const [ auth, setAuth ] = useAuth();
  // state
  const [ orders, setOrders ] = useState( [] );
  const [ loading, setLoading ] = useState( true );
  const [ expandedOrders, setExpandedOrders ] = useState( new Set() );
  const [ status, setStatus ] = useState( [
    "Not processed",
    "Processing", 
    "Shipped",
    "Delivered",
    "Cancelled",
  ] );
  const [ changedStatus, setChangedStatus ] = useState( "" );

  useEffect( () =>
  {
    if ( auth?.token ) getOrders();
  }, [ auth?.token ] );

  const getOrders = async () =>
  {
    try
    {
      setLoading( true );
      const { data } = await axios.get( "/all-orders" );
      setOrders( data );
    } catch ( err )
    {
      console.log( err );
    } finally
    {
      setLoading( false );
    }
  };

  const handleChange = async ( orderId, value ) =>
  {
    setChangedStatus( value );
    try
    {
      const { data } = await axios.put( `/order-status/${ orderId }`, {
        status: value,
      } );
      getOrders();
    } catch ( err )
    {
      console.log( err );
    }
  };

  const toggleOrderExpansion = ( orderId ) => {
    const newExpanded = new Set( expandedOrders );
    if ( newExpanded.has( orderId ) ) {
      newExpanded.delete( orderId );
    } else {
      newExpanded.add( orderId );
    }
    setExpandedOrders( newExpanded );
  };

  const getStatusBadge = ( orderStatus ) => {
    const statusConfig = {
      "Not processed": { variant: "warning", icon: Clock },
      "Processing": { variant: "primary", icon: Package },
      "Shipped": { variant: "default", icon: Truck },
      "Delivered": { variant: "success", icon: CheckCircle2 },
      "Cancelled": { variant: "danger", icon: XCircle },
    };

    const config = statusConfig[orderStatus] || statusConfig["Not processed"];
    const IconComponent = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center space-x-1">
        <IconComponent className="h-3 w-3" />
        <span>{orderStatus}</span>
      </Badge>
    );
  };

  const getStatusIcon = ( orderStatus ) => {
    const icons = {
      "Not processed": Clock,
      "Processing": Package,
      "Shipped": Truck,
      "Delivered": CheckCircle2,
      "Cancelled": XCircle,
    };
    return icons[orderStatus] || Clock;
  };

  if ( loading ) {
    return (
      <PageContainer>
        <PageHeader 
          title={ `Hello ${ auth?.user?.name }` } 
          subtitle="Dashboard" 
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <AdminMenu />
            </div>
            <div className="lg:col-span-3">
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
                  <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
                    { [ 1, 2, 3 ].map( ( n ) => (
                      <div key={ n } className="border rounded-lg p-4 mb-4">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                      </div>
                    ) ) }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader 
        title={ `Hello ${ auth?.user?.name }` } 
        subtitle="Dashboard" 
        gradient="from-indigo-500 to-purple-600"
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Admin Menu */}
          <div className="lg:col-span-1">
            <AdminMenu />
          </div>

          {/* Orders Content */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Orders Header */}
              <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center space-x-2">
                    <Package2 className="h-6 w-6" />
                    <span>Order Management</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Total Orders: <span className="font-semibold text-gray-900 dark:text-gray-100">{ orders?.length || 0 }</span>
                  </div>
                </CardContent>
              </Card>

              {/* Orders List */}
              <AnimatePresence>
                { orders?.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="text-center py-12"
                  >
                    <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No orders found</h3>
                    <p className="text-gray-500 dark:text-gray-400">Orders will appear here when customers place them.</p>
                  </motion.div>
                ) : (
                  <div className="space-y-6">
                    { orders?.map( ( order, index ) => {
                      const isExpanded = expandedOrders.has( order.id );
                      return (
                        <motion.div
                          key={ order.id }
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="bg-white dark:bg-gray-900 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          {/* Order Header */}
                          <div 
                            className="p-6 cursor-pointer"
                            onClick={ () => toggleOrderExpansion( order.id ) }
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                                  { index + 1 }
                                </div>
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    Order #{ order.id.slice( -6 ).toUpperCase() }
                                  </h3>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    { order?.products?.length } { order?.products?.length === 1 ? 'item' : 'items' }
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-4">
                                { getStatusBadge( order?.status ) }
                                { isExpanded ? (
                                  <ChevronUp className="h-5 w-5 text-gray-400" />
                                ) : (
                                  <ChevronDown className="h-5 w-5 text-gray-400" />
                                ) }
                              </div>
                            </div>

                            {/* Quick Info Row */}
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                                <User className="h-4 w-4" />
                                <span>{ order?.buyer?.name }</span>
                              </div>
                              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                                <Calendar className="h-4 w-4" />
                                <span>{ moment( order?.createdAt ).fromNow() }</span>
                              </div>
                              <div className="flex items-center space-x-2 text-sm">
                                <CreditCard className="h-4 w-4" />
                                <Badge 
                                  variant={ order?.payment?.success ? "success" : "danger" }
                                  size="sm"
                                >
                                  { order?.payment?.success ? "Success" : "Failed" }
                                </Badge>
                              </div>
                            </div>
                          </div>

                          {/* Expanded Content */}
                          <AnimatePresence>
                            { isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="border-t border-gray-100 dark:border-gray-700 overflow-hidden"
                              >
                                <div className="p-6 bg-gray-50 dark:bg-gray-800 space-y-6">
                                  {/* Status Update */}
                                  <div className="bg-white dark:bg-gray-900 rounded-lg p-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                      Update Order Status
                                    </label>
                                    <Select
                                      value={ order?.status }
                                      onChange={ ( e ) => handleChange( order.id, e.target.value ) }
                                      className="max-w-xs"
                                    >
                                      { status.map( ( s, i ) => (
                                        <option key={ i } value={ s }>
                                          { s }
                                        </option>
                                      ) ) }
                                    </Select>
                                  </div>

                                  {/* Products */}
                                  <div className="space-y-4">
                                    <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">Order Items</h4>
                                    <div className="grid gap-4">
                                      { order?.products?.map( ( product, productIndex ) => (
                                        <motion.div
                                          key={ productIndex }
                                          initial={{ opacity: 0, x: -20 }}
                                          animate={{ opacity: 1, x: 0 }}
                                          transition={{ duration: 0.3, delay: productIndex * 0.1 }}
                                          className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
                                        >
                                          <ProductCardHorizontal 
                                            p={ product } 
                                            remove={ false } 
                                          />
                                        </motion.div>
                                      ) ) }
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            ) }
                          </AnimatePresence>
                        </motion.div>
                      );
                    } ) }
                  </div>
                ) }
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
