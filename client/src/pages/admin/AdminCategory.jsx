import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/auth';
import { PageContainer, PageHeader } from '../../components/ui/PageContainer';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import AdminMenu from '../../components/nav/AdminMenu';
import CategoryForm from '../../components/forms/CategoryForm';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Search, 
  Edit, 
  Folder, 
  FolderPlus,
  Grid3X3,
  LayoutGrid
} from 'lucide-react';
import usePageTitle from '../../hooks/usePageTitle';

export default function AdminCategory() {
  usePageTitle('Manage Categories');
  // Context
  const [auth] = useAuth();

  // State
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [updatingName, setUpdatingName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // grid or list

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    // Filter categories based on search term
    const filtered = categories.filter(category =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [categories, searchTerm]);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/categories");
      const sortedCategories = data.sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
      });
      setCategories(sortedCategories);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    try {
      const { data } = await axios.post("/category", { name: name.trim() });
      if (data?.error) {
        toast.error(data.error);
      } else {
        loadCategories();
        setName("");
        toast.success(`"${data.name}" has been created successfully!`);
      }
    } catch (err) {
      console.log(err);
      toast.error("Create category failed. Please try again");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!updatingName.trim()) return;

    try {
      const { data } = await axios.put(`/category/${selected._id}`, { 
        name: updatingName.trim() 
      });

      if (data?.error) {
        toast.error(data.error);
      } else {
        toast.success(`"${data.name}" has been updated successfully!`);
        setSelected(null);
        setUpdatingName("");
        loadCategories();
        setVisible(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("Category may already exist. Please try again.");
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.delete(`/category/${selected._id}`);

      if (data?.error) {
        toast.error(data.error);
      } else {
        toast.success(`"${data.name}" has been deleted successfully!`);
        setSelected(null);
        loadCategories();
        setVisible(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete category. Please try again.");
    }
  };

  const handleCategoryClick = (category) => {
    setVisible(true);
    setSelected(category);
    setUpdatingName(category.name);
  };

  return (
    <PageContainer>
      <PageHeader
        title={`Welcome back, ${auth?.user?.name}!`}
        subtitle="Manage your product categories"
        gradient="from-indigo-500 to-purple-600"
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <AdminMenu />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Create Category Section */}
            <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                <CardTitle className="flex items-center space-x-2">
                  <FolderPlus className="h-6 w-6" />
                  <span>Create New Category</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CategoryForm
                  value={name}
                  setValue={setName}
                  handleSubmit={handleSubmit}
                  placeholder="Enter category name (e.g., Electronics, Clothing)"
                />
              </CardContent>
            </Card>

            {/* Categories Section */}
            <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Folder className="h-6 w-6 text-indigo-600" />
                    <span>Existing Categories ({filteredCategories.length})</span>
                  </CardTitle>
                  
                  <div className="flex items-center space-x-4">
                    {/* Search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                      <Input
                        type="text"
                        placeholder="Search categories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    
                    {/* View Mode Toggle */}
                    <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 p-1">
                      <Button
                        variant={viewMode === "grid" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("grid")}
                        className="px-3 py-1"
                      >
                        <LayoutGrid className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={viewMode === "list" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("list")}
                        className="px-3 py-1"
                      >
                        <Grid3X3 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
                  </div>
                ) : filteredCategories.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12"
                  >
                    <Folder className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                      {searchTerm ? "No categories found" : "No categories yet"}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      {searchTerm 
                        ? `Try adjusting your search term "${searchTerm}"` 
                        : "Create your first category to get started"
                      }
                    </p>
                  </motion.div>
                ) : (
                  <div className={
                    viewMode === "grid" 
                      ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                      : "space-y-2"
                  }>
                    <AnimatePresence>
                      {filteredCategories.map((category, index) => (
                        <motion.div
                          key={category._id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                        >
                          {viewMode === "grid" ? (
                            <motion.div
                              whileHover={{ scale: 1.05, y: -5 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleCategoryClick(category)}
                              className="group relative cursor-pointer rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200/50 dark:border-gray-600/50"
                            >
                              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300" />
                              <div className="relative text-center">
                                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                                  <Folder className="h-6 w-6" />
                                </div>
                                <h3 className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
                                  {category.name}
                                </h3>
                              </div>
                              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <Edit className="h-4 w-4 text-indigo-500" />
                              </div>
                            </motion.div>
                          ) : (
                            <motion.div
                              whileHover={{ x: 5 }}
                              onClick={() => handleCategoryClick(category)}
                              className="group flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/20 dark:hover:to-purple-900/20 border border-gray-200/50 dark:border-gray-600/50 hover:border-indigo-200 dark:hover:border-indigo-700 cursor-pointer transition-all duration-200"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                                  <Folder className="h-5 w-5" />
                                </div>
                                <span className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                                  {category.name}
                                </span>
                              </div>
                              <Edit className="h-4 w-4 text-gray-400 dark:text-gray-500 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors duration-200" />
                            </motion.div>
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Update/Delete Modal */}
      <Modal
        isOpen={visible}
        onClose={() => setVisible(false)}
        title={`Edit Category: ${selected?.name}`}
      >
        <CategoryForm
          value={updatingName}
          setValue={setUpdatingName}
          handleSubmit={handleUpdate}
          placeholder="Enter category name"
          buttonText="Update"
          handleDelete={handleDelete}
        />
      </Modal>
    </PageContainer>
  );
}