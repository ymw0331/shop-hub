import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import {
  Mail, ArrowLeft, Send, CheckCircle
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { cn } from '../../lib/utils';
import usePageTitle from '../../hooks/usePageTitle';
import { ShopHubLogoWithText } from '../../components/logo/ShopHubLogo';

export default function ForgotPassword() {
  usePageTitle('Forgot Password');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post('/forgot-password', { email });

      if (data?.error) {
        toast.error(data.error);
      } else {
        setEmailSent(true);
        toast.success('Check your email for reset instructions');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="max-w-md w-full text-center"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Check your email
            </h2>

            <p className="text-gray-600 dark:text-gray-400 mb-6">
              We've sent password reset instructions to:
            </p>

            <p className="font-medium text-gray-900 dark:text-gray-100 mb-8">
              {email}
            </p>

            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Didn't receive the email? Check your spam folder or try again.
            </p>

            <Button
              onClick={() => {
                setEmailSent(false);
                setEmail('');
              }}
              variant="outline"
              className="w-full"
            >
              Try another email
            </Button>

            <Link
              to="/login"
              className="mt-4 inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to login
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8"
      >
        <div className="text-center">
          <Link to="/" className="inline-block">
            <ShopHubLogoWithText className="justify-center" />
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-gray-100">
            Forgot your password?
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            No worries! Enter your email and we'll send you reset instructions.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
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
                    "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  )}
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              loading={loading}
              disabled={loading}
            >
              <Send className="h-5 w-5 mr-2" />
              Send reset instructions
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}