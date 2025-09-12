import { forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { Check } from 'lucide-react';

const Checkbox = forwardRef(({ className, label, checked, onChange, ...props }, ref) => {
  return (
    <label className="flex items-center cursor-pointer group">
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={onChange}
          ref={ref}
          {...props}
        />
        <div
          className={cn(
            "h-5 w-5 rounded border-2 transition-all duration-200",
            "group-hover:border-indigo-500 dark:group-hover:border-indigo-400",
            checked
              ? "bg-indigo-600 border-indigo-600 dark:bg-indigo-500 dark:border-indigo-500"
              : "bg-white border-gray-300 dark:bg-gray-800 dark:border-gray-600",
            className
          )}
        >
          {checked && (
            <Check className="h-3 w-3 text-white absolute top-0.5 left-0.5" />
          )}
        </div>
      </div>
      {label && (
        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 select-none">
          {label}
        </span>
      )}
    </label>
  );
});

Checkbox.displayName = "Checkbox";

export default Checkbox;