import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  Mail, Lock, Eye, EyeOff, LogIn,
  ArrowRight, Sparkles, CheckCircle
} from 'lucide-react';
import { useAuth } from '../../context/auth';
import Button from '../../components/ui/Button';
import Checkbox from '../../components/ui/Checkbox';
import { cn } from '../../lib/utils';
import usePageTitle from '../../hooks/usePageTitle';
import { ShopHubLogoWithText } from '../../components/logo/ShopHubLogo';

export default function Login() {
  usePageTitle('Login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post('/login', {
        email,
        password
      });

      if (data?.error) {
        toast.error(data.error);
      } else {
        localStorage.setItem('auth', JSON.stringify(data));
        setAuth({ ...auth, token: data.token, user: data.user });
        toast.success('Welcome back!');
        
        const redirectPath = location.state || 
          `/dashboard/${data?.user?.role === 1 ? 'admin' : 'user'}`;
        navigate(redirectPath);
      }
    } catch (error) {
      console.error(error);
      toast.error('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full space-y-8"
        >
          {/* Logo */}
          <div className="text-center">
            <Link to="/" className="inline-block">
              <ShopHubLogoWithText className="justify-center" />
            </Link>
            <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-gray-100">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                Sign up for free
              </Link>
            </p>
          </div>

          {/* Form */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={cn(
                      "block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg",
                      "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent",
                      "placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200",
                      "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    )}
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={cn(
                      "block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg",
                      "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent",
                      "placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200",
                      "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    )}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Checkbox
                label="Remember me"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <Link
                to="/forgot-password"
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full"
              loading={loading}
              disabled={loading}
            >
              <LogIn className="h-5 w-5 mr-2" />
              Sign in
            </Button>
          </form>
        </motion.div>
      </div>

      {/* Right Side - Image/Marketing */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Animated Background Elements */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000" />
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative z-10 flex flex-col justify-center px-12 text-white"
        >
          <div className="max-w-md">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="h-8 w-8" />
              <span className="text-2xl font-semibold">Premium Shopping</span>
            </div>
            
            <h2 className="text-4xl font-bold mb-6 leading-tight">
              Your favorite brands, all in one place
            </h2>
            
            <p className="text-lg mb-8 text-white/90">
              Join millions of happy customers and discover amazing products at unbeatable prices.
            </p>
            
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex items-center gap-3"
              >
                <CheckCircle className="h-5 w-5 text-white/90" />
                <span className="text-white/90">Secure shopping experience</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex items-center gap-3"
              >
                <CheckCircle className="h-5 w-5 text-white/90" />
                <span className="text-white/90">Track your orders easily</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex items-center gap-3"
              >
                <CheckCircle className="h-5 w-5 text-white/90" />
                <span className="text-white/90">Exclusive member benefits</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="flex items-center gap-3"
              >
                <CheckCircle className="h-5 w-5 text-white/90" />
                <span className="text-white/90">Fast checkout process</span>
              </motion.div>
            </div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="mt-12 flex items-center gap-2 text-white/80"
            >
              <span>New to our platform?</span>
              <Link
                to="/register"
                className="font-medium underline hover:text-white transition-colors inline-flex items-center gap-1"
              >
                Create account
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}