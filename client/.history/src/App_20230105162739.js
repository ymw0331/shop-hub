import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Menu from './components/nav/Menu.jsx';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import UserDashboard from './pages/user/Dashboard.jsx';
import AdminDashboard from './pages/admin/Dashboard.jsx';
import AdminCategory from './pages/admin/Category.jsx';
import AdminProduct from './pages/admin/Product.jsx';
import UserRoute from './components/routes/UserRoute.jsx';
import AdminRoute from './components/routes/AdminRoute.jsx';


const PageNotFound = () =>
{
  return ( <div className='d-flex justify-content-center align-items-center vh-100'>
    404 | Page not found
  </div> );
};

export default function App ()
{
  return (
    <BrowserRouter>
      <Menu />
      <Toaster />
      <Routes>
        <Route>
          <Route path='/' element={ <Home /> } />
          <Route path='/login' element={ <Login /> } />
          <Route path='/register' element={ <Register /> } />

          <Route path='/dashboard' element={ <UserRoute /> } >
            <Route path='user' element={ <UserDashboard /> } />
          </Route>

          <Route path='/dashboard' element={ <AdminRoute /> } >
            <Route path='admin' element={ <AdminDashboard /> } />
            <Route path='admin' element={ <AdminCategory /> } />
            <Route path='admin' element={ <AdminProduct /> } />
          </Route>


        </Route>
        <Route path='*' element={ <PageNotFound /> } />
      </Routes>

    </BrowserRouter>
  );
}

