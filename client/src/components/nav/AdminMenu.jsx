import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FolderPlus, PackagePlus, Package, ShoppingCart, Settings } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';

const menuItems = [
  {
    to: "/dashboard/admin/category",
    label: "Create category",
    icon: FolderPlus,
    description: "Manage product categories"
  },
  {
    to: "/dashboard/admin/product",
    label: "Create product",
    icon: PackagePlus,
    description: "Add new products"
  },
  {
    to: "/dashboard/admin/products",
    label: "Products",
    icon: Package,
    description: "View all products"
  },
  {
    to: "/dashboard/admin/orders",
    label: "Manage orders",
    icon: ShoppingCart,
    description: "Process customer orders"
  }
];

export default function AdminMenu() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="sticky top-6"
    >
      <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-6 w-6" />
            <span>Admin Panel</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <nav className="space-y-1 p-4">
            {menuItems.map((item, index) => (
              <motion.div
                key={item.to}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `group flex items-center space-x-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/20 dark:hover:to-purple-900/20 hover:text-indigo-700 dark:hover:text-indigo-400"
                    }`
                  }
                >
                  <item.icon className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
                  <div className="flex-1">
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs opacity-80">{item.description}</div>
                  </div>
                </NavLink>
              </motion.div>
            ))}
          </nav>
        </CardContent>
      </Card>
    </motion.div>
  );
}