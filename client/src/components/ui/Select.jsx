import { forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { ChevronDown } from 'lucide-react';

const Select = forwardRef(({ className, children, label, error, ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          className={cn(
            "flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm dark:bg-gray-800 dark:text-gray-100",
            "appearance-none cursor-pointer",
            "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:focus:ring-indigo-400",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "transition-all duration-200",
            error ? "border-red-500 focus:ring-red-500 dark:border-red-400 dark:focus:ring-red-400" : "border-gray-300 dark:border-gray-600",
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
});

Select.displayName = "Select";

export default Select;