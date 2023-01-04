import { NavLink } from 'react-router-dom';

export default function Menu ()
{
  return (
    <>
      <ul className="nav">
        <li className="nav-item">
          <NavLink className="nav-link active" aria-current="page" href="#">Active</NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" href="#">Link</NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" href="#">Link</NavLink>
        </li>

      </ul>
    </>
  );
} 