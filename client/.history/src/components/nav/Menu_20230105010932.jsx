import { NavLink } from 'react-router-dom';

export default function Menu ()
{
  return (
    <>
      <ul className="nav d-flex justify-content-between shadow-sm mb-2">
        <li className="nav-item">
          <NavLink className="nav-link active" aria-current="page" to="/">HOME</NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="login">LOGIN</NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="register">REGISTER</NavLink>
        </li>
      </ul>
    </>
  );
} 