import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

const Radio = forwardRef(({ className, label, checked, onChange, name, value, ...props }, ref) => {
  return (
    <label className="flex items-center cursor-pointer group">
      <div className="relative">
        <input
          type="radio"
          className="sr-only"
          checked={checked}
          onChange={onChange}
          name={name}
          value={value}
          ref={ref}
          {...props}
        />
        <div
          className={cn(
            "h-5 w-5 rounded-full border-2 transition-all duration-200",
            "group-hover:border-indigo-500 dark:group-hover:border-indigo-400",
            checked
              ? "border-indigo-600 dark:border-indigo-500"
              : "border-gray-300 dark:border-gray-600",
            className
          )}
        >
          {checked && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full bg-indigo-600 dark:bg-indigo-500" />
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

Radio.displayName = "Radio";

export const RadioGroup = ({ children, className }) => {
  return (
    <div className={cn("space-y-2", className)}>
      {children}
    </div>
  );
};

export default Radio;