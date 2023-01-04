import { NavLink } from 'react-router-dom';

export default function Menu ()
{
  return (
    <>
      <ul className="nav d-flex justify-content-center">
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