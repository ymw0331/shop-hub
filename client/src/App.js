import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import ModernMenu from './components/nav/ModernMenu.jsx';
import CartDrawer from './components/cart/CartDrawer.jsx';
import { useCartDrawer } from './context/cartDrawer';
import ModernHome from './pages/ModernHome';
import Shop from './pages/Shop';
import ProductView from './pages/ProductView.jsx';
import Search from './pages/Search.jsx';
import CategoriesList from './pages/CategoriesList.jsx';
import CategoryView from './pages/CategoryView.jsx';
import Cart from './pages/Cart.jsx';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
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
      <ModernMenu />
      <CartDrawer isOpen={cartDrawerOpen} onClose={() => setCartDrawerOpen(false)} />
      <Toaster position='top-right' />
      <Routes>
        <Route>
          <Route path='/' element={ <ModernHome /> } />
          <Route path='/shop' element={ <Shop /> } />
          <Route path='/categories' element={ <CategoriesList /> } />
          <Route path='/category/:slug' element={ <CategoryView /> } />
          <Route path='/cart' element={ <Cart /> } />
          <Route path='/search' element={ <Search /> } />
          <Route path='/product/:slug' element={ <ProductView /> } />
          <Route path='/login' element={ <Login /> } />
          <Route path='/register' element={ <Register /> } />

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

