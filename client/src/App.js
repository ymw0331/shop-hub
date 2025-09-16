import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Menu from './components/nav/Menu.jsx';
import CartDrawer from './components/cart/CartDrawer.jsx';
import Footer from './components/layout/Footer.jsx';
import { useCartDrawer } from './context/cartDrawer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductView from './pages/ProductView';
import Search from './pages/Search';
import CategoriesList from './pages/CategoriesList';
import CategoryView from './pages/CategoryView';
import Collections from './pages/Collections';
import CollectionView from './pages/CollectionView';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminCategory from './pages/admin/AdminCategory.jsx';
import AdminProduct from './pages/admin/AdminProduct.jsx';
import AdminProducts from './pages/admin/AdminProducts.jsx';
import AdminProductUpdate from './pages/admin/AdminProductUpdate.jsx';
import AdminOrders from './pages/admin/AdminOrders.jsx';
import UserDashboard from './pages/user/UserDashboard.jsx';
import UserProfile from './pages/user/UserProfile.jsx';
import UserOrders from './pages/user/UserOrders.jsx';
import UserRoute from './components/routes/UserRoute.jsx';
import AdminRoute from './components/routes/AdminRoute.jsx';


const PageNotFound = () =>
{
  return (
    <div
      className='flex justify-center items-center h-screen'>
      <div className='text-2xl text-gray-600'>404 | Page not found</div>
    </div>
  );
};

function AppContent() {
  const [cartDrawerOpen, setCartDrawerOpen] = useCartDrawer();
  
  return (
    <>
      <Menu />
      <CartDrawer isOpen={cartDrawerOpen} onClose={() => setCartDrawerOpen(false)} />
      <Toaster position='top-right' />
      <Routes>
        <Route>
          <Route path='/' element={ <Home /> } />
          <Route path='/shop' element={ <Shop /> } />
          <Route path='/categories' element={ <CategoriesList /> } />
          <Route path='/category/:slug' element={ <CategoryView /> } />
          <Route path='/collections' element={ <Collections /> } />
          <Route path='/collections/:slug' element={ <CollectionView /> } />
          <Route path='/cart' element={ <Cart /> } />
          <Route path='/checkout' element={ <Checkout /> } />
          <Route path='/search' element={ <Search /> } />
          <Route path='/product/:slug' element={ <ProductView /> } />
          <Route path='/login' element={ <Login /> } />
          <Route path='/register' element={ <Register /> } />
          <Route path='/forgot-password' element={ <ForgotPassword /> } />
          <Route path='/reset-password' element={ <ResetPassword /> } />

          <Route path='/dashboard' element={ <UserRoute /> } >
            <Route path='user' element={ <UserDashboard /> } />
            <Route path='user/profile' element={ <UserProfile /> } />
            <Route path='user/orders' element={ <UserOrders /> } />
          </Route>

          <Route path='/dashboard' element={ <AdminRoute /> } >
            <Route path='admin' element={ <AdminDashboard /> } />
            <Route path='admin/category' element={ <AdminCategory /> } />
            <Route path='admin/product' element={ <AdminProduct /> } />
            <Route path='admin/products' element={ <AdminProducts /> } />
            <Route
              path="admin/product/update/:slug"
              element={ <AdminProductUpdate /> }
            />
            <Route path='admin/orders' element={ <AdminOrders /> } />

          </Route>


        </Route>
        <Route path='*' element={ <PageNotFound /> } />
      </Routes>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

