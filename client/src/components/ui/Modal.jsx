import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useEffect } from 'react';

export function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  className,
  size = "md",
  ...props 
}) {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl"
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.3 }}
              className={cn(
                "relative w-full rounded-2xl bg-white shadow-2xl dark:bg-gray-800",
                "border border-gray-200/50 dark:border-gray-700/50",
                sizeClasses[size],
                className
              )}
              onClick={(e) => e.stopPropagation()}
              {...props}
            >
              {/* Glass morphism header */}
              {title && (
                <div className="relative overflow-hidden rounded-t-2xl bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-400 px-6 py-4">
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
                  <div className="relative flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-white">{title}</h2>
                    <button
                      onClick={onClose}
                      className="rounded-full p-2 text-white/80 hover:bg-white/20 hover:text-white transition-all duration-200"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="p-6">
                {children}
              </div>

              {/* Close button if no title */}
              {!title && (
                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-300 transition-all duration-200"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}