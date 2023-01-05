import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Menu from './components/nav/Menu.jsx';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/user/Dashboard.jsx';
import AdminDashboard from './pages/admin/Dashboard.jsx';
import PrivateRoute from './components/routes/PrivateRoute.jsx';
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
          <Route path='/dashboard' element={ <PrivateRoute /> } >
            <Route path='user' element={ <Dashboard /> } />
          </Route>

          <Route path='/dashboard' element={ <AdminRoute /> } >
            <Route path='admin' element={ <AdminDashboard /> } />
          </Route>


        </Route>
        <Route path='*' element={ <PageNotFound /> } />
      </Routes>

    </BrowserRouter>
  );
}

