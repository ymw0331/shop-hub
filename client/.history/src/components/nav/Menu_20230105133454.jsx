import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/auth';

export default function Menu ()
{
  //hooks
  const [ auth, setAuth ] = useAuth();
  return (
    <>
      <ul className="nav d-flex justify-content-between shadow-sm mb-2">
        <li className="nav-item">
          <NavLink className="nav-link " aria-current="page" to="/">HOME</NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="login">LOGIN</NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="register">REGISTER</NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="register">LOGOUT</NavLink>
        </li>
      </ul>
    </>
  );
} 