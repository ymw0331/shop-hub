import { motion } from 'framer-motion';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { cn } from '../../lib/utils';

export default function CategoryForm({
  value,
  setValue,
  handleSubmit,
  placeholder,
  buttonText = "Submit",
  handleDelete,
  className
}) {
  const isUpdate = buttonText === "Update";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("space-y-6", className)}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="h-12 text-lg pl-4 pr-4 border-2 focus:border-indigo-500 transition-all duration-200"
            required
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <motion.div
              animate={{ rotate: value ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {isUpdate ? (
                <Edit className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              ) : (
                <Plus className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              )}
            </motion.div>
          </div>
        </div>

        <div className="flex items-center justify-between space-x-4">
          <Button
            type="submit"
            variant="default"
            size="lg"
            className="flex-1 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            {isUpdate ? (
              <>
                <Edit className="mr-2 h-5 w-5" />
                {buttonText}
              </>
            ) : (
              <>
                <Plus className="mr-2 h-5 w-5" />
                {buttonText}
              </>
            )}
          </Button>

          {handleDelete && (
            <Button
              type="button"
              onClick={handleDelete}
              variant="danger"
              size="lg"
              className="h-12 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          )}
        </div>
      </form>
    </motion.div>
  );
}