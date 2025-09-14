import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Search, 
  Menu as MenuIcon, 
  X, 
  User, 
  ChevronDown,
  Home,
  ShoppingBag,
  Grid3x3,
  LogIn,
  UserPlus,
  LogOut,
  LayoutDashboard
} from 'lucide-react';
import { useAuth } from '../../context/auth';
import { useCart } from '../../context/cart';
import { useCartDrawer } from '../../context/cartDrawer';
import useCategory from '../../hooks/useCategory';
import { cn } from '../../lib/utils';
// Badge import removed - not used
import SearchModal from './SearchModal';
import { ShopHubLogoWithText } from '../logo/ShopHubLogo';
import ThemeToggle from '../ui/ThemeToggle';

export default function Menu() {
  const [auth, setAuth] = useAuth();
  const [cart] = useCart();
  const [, setCartDrawerOpen] = useCartDrawer();
  const categories = useCategory();
  const navigate = useNavigate();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const logout = () => {
    setAuth({ ...auth, user: null, token: "" });
    localStorage.removeItem("auth");
    navigate("/login");
  };

  const navLinkClass = ({ isActive }) =>
    cn(
      "flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors rounded-md",
      isActive 
        ? "text-primary bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400" 
        : "text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800"
    );

  return (
    <>
      <nav className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300",
        isScrolled 
          ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-md dark:shadow-gray-800/50" 
          : "bg-white dark:bg-gray-900 shadow-sm dark:shadow-gray-800/30"
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo & Desktop Nav */}
            <div className="flex items-center gap-8">
              <NavLink to="/">
                <ShopHubLogoWithText />
              </NavLink>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-1">
                <NavLink to="/" className={navLinkClass}>
                  <Home className="h-4 w-4" />
                  Home
                </NavLink>
                <NavLink to="/shop" className={navLinkClass}>
                  <ShoppingBag className="h-4 w-4" />
                  Shop
                </NavLink>

                {/* Categories Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <Grid3x3 className="h-4 w-4" />
                    Categories
                    <ChevronDown className={cn(
                      "h-4 w-4 transition-transform",
                      categoryDropdownOpen && "rotate-180"
                    )} />
                  </button>
                  
                  {categoryDropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 max-h-96 overflow-y-auto">
                      <NavLink
                        to="/categories"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary"
                        onClick={() => setCategoryDropdownOpen(false)}
                      >
                        All Categories
                      </NavLink>
                      {categories?.map((c) => (
                        <NavLink
                          key={c.id}
                          to={`/category/${c.slug}`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary"
                          onClick={() => setCategoryDropdownOpen(false)}
                        >
                          {c.name}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center gap-2">
              {/* Search Button */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-gray-600 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Cart */}
              <button
                onClick={() => setCartDrawerOpen(true)}
                className="relative p-2 text-gray-600 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
              >
                <ShoppingCart className="h-5 w-5" />
                {cart?.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </button>

              {/* Theme Toggle */}
              <ThemeToggle className="hidden md:block" />

              {/* User Menu */}
              {!auth?.user ? (
                <div className="hidden md:flex items-center gap-2">
                  <NavLink
                    to="/login"
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary transition-colors"
                  >
                    <LogIn className="h-4 w-4" />
                    Login
                  </NavLink>
                  <NavLink
                    to="/register"
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-blue-700 rounded-md transition-colors"
                  >
                    <UserPlus className="h-4 w-4" />
                    Register
                  </NavLink>
                </div>
              ) : (
                <div className="relative hidden md:block">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <User className="h-4 w-4" />
                    {auth?.user.name}
                    <ChevronDown className={cn(
                      "h-4 w-4 transition-transform",
                      userDropdownOpen && "rotate-180"
                    )} />
                  </button>
                  
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                      <NavLink
                        to={`/dashboard/${auth?.user?.role === 1 ? "admin" : "user"}`}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </NavLink>
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary text-left"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <MenuIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-4 space-y-2">
              <NavLink
                to="/"
                className={navLinkClass}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Home className="h-4 w-4" />
                Home
              </NavLink>
              <NavLink
                to="/shop"
                className={navLinkClass}
                onClick={() => setMobileMenuOpen(false)}
              >
                <ShoppingBag className="h-4 w-4" />
                Shop
              </NavLink>
              <NavLink
                to="/categories"
                className={navLinkClass}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Grid3x3 className="h-4 w-4" />
                All Categories
              </NavLink>
              
              {!auth?.user ? (
                <>
                  <NavLink
                    to="/login"
                    className={navLinkClass}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <LogIn className="h-4 w-4" />
                    Login
                  </NavLink>
                  <NavLink
                    to="/register"
                    className={navLinkClass}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <UserPlus className="h-4 w-4" />
                    Register
                  </NavLink>
                </>
              ) : (
                <>
                  <NavLink
                    to={`/dashboard/${auth?.user?.role === 1 ? "admin" : "user"}`}
                    className={navLinkClass}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </NavLink>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md transition-colors text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}