import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

export default function PageHeader({ title, subtitle, className, children }) {
  return (
    <div className={cn("relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-8 mb-8", className)}>
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative z-10">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-white mb-2"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-white/90"
          >
            {subtitle}
          </motion.p>
        )}
        {children}
      </div>
      
      {/* Animated background elements */}
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl animate-pulse" />
      <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse delay-700" />
    </div>
  );
}