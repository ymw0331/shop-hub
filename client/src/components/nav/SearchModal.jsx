import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import axios from 'axios';
import { useSearch } from '../../context/search';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function SearchModal({ isOpen, onClose }) {
  const [keyword, setKeyword] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useSearch();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    // Load recent searches from localStorage
    const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    setRecentSearches(recent.slice(0, 5));
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    
    setLoading(true);
    try {
      const { data } = await axios.get(`/products/search/${keyword}`);
      setValues({ ...values, results: data, keyword });
      
      // Save to recent searches
      const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]');
      const updated = [keyword, ...recent.filter(s => s !== keyword)].slice(0, 5);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
      
      onClose();
      navigate('/search');
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const handleRecentSearch = (search) => {
    setKeyword(search);
    handleSubmit({ preventDefault: () => {} });
  };

  const clearRecentSearches = () => {
    localStorage.removeItem('recentSearches');
    setRecentSearches([]);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 w-full max-w-2xl bg-white rounded-xl shadow-2xl z-50"
          >
            <div className="p-4">
              <form onSubmit={handleSubmit}>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Search for products..."
                    className="w-full pl-12 pr-12 py-4 text-lg border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-400" />
                  </button>
                </div>
              </form>

              {/* Recent Searches */}
              {recentSearches.length > 0 && !keyword && (
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Recent Searches
                    </h3>
                    <button
                      onClick={clearRecentSearches}
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleRecentSearch(search)}
                        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Searches */}
              {!keyword && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4" />
                    Popular Searches
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {['Electronics', 'Fashion', 'Home', 'Sports', 'Books'].map((term) => (
                      <button
                        key={term}
                        onClick={() => setKeyword(term)}
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-primary rounded-full text-sm transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}