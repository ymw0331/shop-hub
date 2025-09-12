/* eslint-disable jsx-a11y/img-redundant-alt */
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/auth';
import { PageContainer, PageHeader } from '../../components/ui/PageContainer';
import AdminMenu from '../../components/nav/AdminMenu';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, Trash2, Package2, DollarSign, Hash, Truck, Image as ImageIcon, AlertTriangle } from 'lucide-react';
import usePageTitle from '../../hooks/usePageTitle';



export default function AdminProductUpdate ()
{
  usePageTitle('Update Product');
  //context
  const [ auth, setAuth ] = useAuth();

  //state
  const [ categories, setCategories ] = useState( [] );
  const [ photo, setPhoto ] = useState( "" );
  const [ name, setName ] = useState( "" );
  const [ description, setDescription ] = useState( "" );
  const [ price, setPrice ] = useState( "" );
  const [ category, setCategory ] = useState( "" );
  const [ shipping, setShipping ] = useState( "" );
  const [ quantity, setQuantity ] = useState( "" );
  const [ id, setId ] = useState( "" );
  const [ loading, setLoading ] = useState( false );
  const [ showDeleteModal, setShowDeleteModal ] = useState( false );

  //hook
  const navigate = useNavigate();
  const params = useParams();

  // console.log( "params =>", params );

  useEffect( () =>
  {
    loadProduct();
  }, [] );

  useEffect( () =>
  {
    loadCategories();
  }, [] );

  const loadCategories = async () =>
  {
    try
    {
      const { data } = await axios.get( "/categories" );
      setCategories( data );
    } catch ( err )
    {
      console.log( err );
    }
  };

  const loadProduct = async () =>
  {
    try
    {
      const { data } = await axios.get( `/product/${ params.slug }` );
      // console.log( "data =>", data );
      setName( data.name );
      setDescription( data.description );
      setPrice( data.price );
      setCategory( data.category._id );
      setShipping( data.shipping );
      setQuantity( data.quantity );
      setId( data._id );
    } catch ( err )
    {
      console.log( err );
    }
  };


  const handleSubmit = async ( e ) =>
  {
    e.preventDefault();
    setLoading(true);
    try
    {
      const productData = new FormData();
      photo && productData.append( 'photo', photo );
      productData.append( 'name', name );
      productData.append( 'description', description );
      productData.append( 'price', price );
      productData.append( 'category', category );
      productData.append( 'shipping', shipping );
      productData.append( 'quantity', quantity );

      const { data } = await axios.put( `/product/${ id }`, productData );
      if ( data?.error )
      {
        toast.error( data.error );
      }
      else
      {
        toast.success( ` "${ data.name }" is updated ` );
        navigate( '/dashboard/admin/products' );
      }

    } catch ( err )
    {
      console.log( err );
      toast.error( 'Product update failed. Please try again' );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async ( ) =>
  {
    setLoading(true);
    try
    {
      const { data } = await axios.delete( `/product/${ id }` );
      toast.success( `${ data.name } is deleted` );
      navigate( "/dashboard/admin/products" );

    } catch ( error )
    {
      console.log( error );
      toast.error( 'Product delete failed. Please try again' );
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  // Sort categories alphabetically
  const sortedCategories = categories.sort(function (a, b) {
    a = a.name.toLowerCase();
    b = b.name.toLowerCase();
    return a < b ? -1 : a > b ? 1 : 0;
  });

  return (
    <PageContainer>
      <PageHeader
        title={`Hello ${auth?.user?.name}`}
        subtitle="Update Product"
        gradient="from-indigo-500 to-purple-600"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <AdminMenu />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                  <CardTitle className="flex items-center space-x-2">
                    <Package2 className="h-6 w-6" />
                    <span>Update Product</span>
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Photo Upload Section */}
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Product Image
                      </label>
                      
                      {/* Current or New Image Preview */}
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="flex justify-center mb-4"
                      >
                        <div className="relative rounded-xl overflow-hidden shadow-lg">
                          <img 
                            src={
                              photo 
                                ? URL.createObjectURL(photo)
                                : `${process.env.REACT_APP_API}/product/photo/${id}?${new Date().getTime()}`
                            }
                            alt="Product" 
                            className="w-48 h-48 object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </div>
                      </motion.div>

                      {/* Upload Button */}
                      <label className="group relative flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-xl cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 hover:border-indigo-500">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <ImageIcon className="w-8 h-8 mb-2 text-gray-400 dark:text-gray-500 group-hover:text-indigo-500 transition-colors" />
                          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                            <span className="font-semibold">{photo ? photo.name : "Change photo"}</span>
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG or JPEG (MAX. 5MB)</p>
                        </div>
                        <input
                          type="file"
                          name="photo"
                          accept="image/*"
                          onChange={e => setPhoto(e.target.files[0])}
                          className="hidden"
                        />
                      </label>
                    </motion.div>

                    {/* Form Fields Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Product Name */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                      >
                        <Input
                          label="Product Name"
                          type="text"
                          placeholder="Enter product name"
                          value={name}
                          onChange={e => setName(e.target.value)}
                          className="bg-white/80 dark:bg-gray-800/80"
                        />
                      </motion.div>

                      {/* Price */}
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                        className="relative"
                      >
                        <Input
                          label="Price"
                          type="number"
                          placeholder="0.00"
                          value={price}
                          onChange={e => setPrice(e.target.value)}
                          className="bg-white/80 dark:bg-gray-800/80 pl-8"
                        />
                        <DollarSign className="absolute left-3 top-9 h-4 w-4 text-gray-400 dark:text-gray-500" />
                      </motion.div>

                      {/* Category */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 }}
                      >
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Category
                        </label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                          onChange={(e) => setCategory(e.target.value)}
                          value={category}
                        >
                          <option value="">Choose category</option>
                          {sortedCategories?.map((c) => (
                            <option key={c._id} value={c._id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </motion.div>

                      {/* Quantity */}
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.4 }}
                        className="relative"
                      >
                        <Input
                          label="Quantity"
                          type="number"
                          min="1"
                          placeholder="Enter quantity"
                          value={quantity}
                          onChange={e => setQuantity(e.target.value)}
                          className="bg-white/80 dark:bg-gray-800/80 pl-8"
                        />
                        <Hash className="absolute left-3 top-9 h-4 w-4 text-gray-400 dark:text-gray-500" />
                      </motion.div>

                      {/* Shipping */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.5 }}
                        className="md:col-span-2"
                      >
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          <span className="flex items-center space-x-2">
                            <Truck className="h-4 w-4" />
                            <span>Shipping Available</span>
                          </span>
                        </label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                          onChange={(e) => setShipping(e.target.value)}
                          value={shipping}
                        >
                          <option value="">Choose shipping option</option>
                          <option value="0">No</option>
                          <option value="1">Yes</option>
                        </select>
                      </motion.div>
                    </div>

                    {/* Description */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.6 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Description
                      </label>
                      <textarea
                        className="w-full h-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
                        placeholder="Enter product description"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        rows="4"
                      />
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.7 }}
                      className="flex flex-col sm:flex-row gap-4 pt-6"
                    >
                      <Button
                        type="submit"
                        loading={loading}
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 px-8 py-3 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex-1"
                      >
                        <Save className="mr-2 h-5 w-5" />
                        Update Product
                      </Button>
                      
                      <Button
                        type="button"
                        variant="danger"
                        onClick={() => setShowDeleteModal(true)}
                        disabled={loading}
                        className="px-8 py-3 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 sm:w-auto"
                      >
                        <Trash2 className="mr-2 h-5 w-5" />
                        Delete Product
                      </Button>
                    </motion.div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-6"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Delete Product</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Are you sure you want to delete "{name}"? This action cannot be undone.
              </p>
              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={loading}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={handleDelete}
                  loading={loading}
                  className="flex-1"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </PageContainer>
  );
};