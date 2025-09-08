import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, TrendingUp, Shield, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';

export default function HeroSection() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <TrendingUp className="h-5 w-5" />,
      title: "Trending Products",
      description: "Latest and most popular items"
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Secure Payment",
      description: "100% secure transactions"
    },
    {
      icon: <Truck className="h-5 w-5" />,
      title: "Fast Delivery",
      description: "Free shipping on orders over $100"
    }
  ];

  return (
    <div className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* Floating Shapes */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-20 left-10 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20"
      />
      <motion.div
        animate={{
          y: [0, 20, 0],
          rotate: [360, 180, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute bottom-20 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Discover Amazing
              <span className="text-primary block">Products Today</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Shop the latest trends with unbeatable prices. Quality products, 
              fast delivery, and exceptional service.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button
                onClick={() => navigate('/shop')}
                size="lg"
                className="shadow-lg hover:shadow-xl transition-shadow"
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                Shop Now
              </Button>
              <Button
                onClick={() => navigate('/categories')}
                variant="outline"
                size="lg"
              >
                Browse Categories
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100">{feature.title}</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Content - Hero Image/Animation */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative h-96 lg:h-[500px]">
              {/* Animated Shopping Bags */}
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute top-10 right-10 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-xl"
              >
                <ShoppingBag className="h-12 w-12 text-primary" />
              </motion.div>
              
              <motion.div
                animate={{
                  y: [0, 10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
                className="absolute bottom-10 left-10 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-xl"
              >
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">2,000+ Products</span>
                </div>
              </motion.div>

              <motion.div
                animate={{
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              >
                <div className="w-64 h-64 bg-gradient-to-br from-primary to-purple-600 rounded-3xl opacity-20"></div>
              </motion.div>

              {/* Stats Cards */}
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
                className="absolute top-1/3 right-1/4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg"
              >
                <p className="text-2xl font-bold text-primary">50K+</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Happy Customers</p>
              </motion.div>

              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.5
                }}
                className="absolute bottom-1/3 left-1/4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg"
              >
                <p className="text-2xl font-bold text-green-600">24/7</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Customer Support</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}