import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Package, Settings, Home } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function UserMenu() {
  const menuItems = [
    {
      to: "/dashboard/user",
      label: "Dashboard",
      icon: Home,
    },
    {
      to: "/dashboard/user/profile",
      label: "Profile",
      icon: User,
    },
    {
      to: "/dashboard/user/orders", 
      label: "Orders",
      icon: Package,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">Navigation</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Manage your account</p>
      </div>

      {/* Navigation Menu */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
        <nav className="p-2">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.to}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.1 }}
            >
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                    "hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/20 dark:hover:to-purple-900/20 hover:shadow-md",
                    isActive
                      ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg"
                      : "text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                  )
                }
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            </motion.div>
          ))}
        </nav>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 text-white"
      >
        <div className="flex items-center gap-3 mb-3">
          <Settings className="w-5 h-5" />
          <h4 className="font-medium">Quick Actions</h4>
        </div>
        <p className="text-sm text-white/80 mb-4">
          Need help or want to update your preferences?
        </p>
        <button className="w-full bg-white/20 backdrop-blur-sm rounded-lg py-2 px-4 text-sm font-medium hover:bg-white/30 transition-all duration-200 border border-white/20">
          Account Settings
        </button>
      </motion.div>
    </motion.div>
  );
}