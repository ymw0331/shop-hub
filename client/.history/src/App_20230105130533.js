import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import {
  AuthProvider
} from "./context/"

import Menu from './components/nav/Menu.jsx';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

