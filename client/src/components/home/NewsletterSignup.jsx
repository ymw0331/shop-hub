import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Mail, Send, CheckCircle, Gift, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    try {
      setLoading(true);
      await axios.post('/newsletter/subscribe', { email, name });
      setSubscribed(true);
      toast.success('Welcome to our newsletter!');
      setEmail('');
      setName('');

      // Reset success state after 5 seconds
      setTimeout(() => setSubscribed(false), 5000);
    } catch (error) {
      if (error.response?.data?.error === 'Email already subscribed') {
        toast.error('You\'re already subscribed!');
      } else {
        toast.error('Failed to subscribe. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-800 dark:to-purple-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-white/10 backdrop-blur-md p-8 md:p-12"
        >
          {/* Decorative Elements */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-400 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-pink-400 rounded-full opacity-20 blur-3xl"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <div className="text-white">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="h-10 w-10" />
                <h2 className="text-3xl md:text-4xl font-bold">
                  Stay in the Loop
                </h2>
              </div>

              <p className="text-lg mb-6 text-white/90">
                Get exclusive deals, early access to sales, and the latest product launches delivered straight to your inbox!
              </p>

              {/* Benefits */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Gift className="h-5 w-5" />
                  </div>
                  <span className="text-white/90">10% off your first order</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Zap className="h-5 w-5" />
                  </div>
                  <span className="text-white/90">Flash sale alerts & VIP access</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Mail className="h-5 w-5" />
                  </div>
                  <span className="text-white/90">Weekly style inspiration & tips</span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center gap-4 text-sm text-white/70">
                <span>🔒 No spam</span>
                <span>✨ Unsubscribe anytime</span>
                <span>💎 VIP perks</span>
              </div>
            </div>

            {/* Right Content - Form */}
            <div>
              {subscribed ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center"
                >
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    You're In!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Check your email for a welcome gift 🎁
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl p-8">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                    Join 50,000+ Happy Shoppers
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label htmlFor="newsletter-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Name (optional)
                      </label>
                      <input
                        type="text"
                        id="newsletter-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                      />
                    </div>

                    <div>
                      <label htmlFor="newsletter-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email address *
                      </label>
                      <input
                        type="email"
                        id="newsletter-email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Subscribing...
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5" />
                          Subscribe & Save 10%
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
                    By subscribing, you agree to receive marketing emails.
                    View our <a href="/privacy" className="underline">Privacy Policy</a>.
                  </p>
                </form>
              )}
            </div>
          </div>

          {/* Subscriber Count */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white">
              <span className="animate-pulse">🔥</span>
              <span className="text-sm font-medium">
                {Math.floor(Math.random() * 50) + 100} people subscribed this week
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}