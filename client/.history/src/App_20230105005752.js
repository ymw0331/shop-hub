import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Menu from './components/'

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

export default function App ()
{
  return (
    <BrowserRouter>
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

