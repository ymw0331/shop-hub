import { cn } from '../../lib/utils';

export default function PageContainer({ children, className, ...props }) {
  return (
    <div
      className={cn(
        "min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800",
        className
      )}
      {...props}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  );
}