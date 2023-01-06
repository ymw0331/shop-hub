/* eslint-disable jsx-a11y/anchor-is-valid */
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/auth';
import { useNavigate } from 'react-router-dom';


export default function Menu ()
{
  //hooks
  const [ auth, setAuth ] = useAuth();
  const navigate = useNavigate();

  const logout = () =>
  {
    setAuth( { ...auth, user: null, token: "" } );
    localStorage.removeItem( "auth" );
    navigate( "/login" );
  };

  return (
    <>
      <ul className="nav d-flex justify-content-between shadow-sm mb-2">
        <li className="nav-item">
          <NavLink className="nav-link " aria-current="page" to="/">HOME</NavLink>
        </li>

        <li className="nav-item">
          <NavLink className="nav-link " aria-current="page" to="/shop">SHOP</NavLink>
        </li>

        <form className='d-flex'>
          <input
            type="search"
            style={ { borderRadius: "0px" } }
            className="form-control"
            placeholder="Search"
          />

          <button
            className='btn btn-outline-primary'
            type='submit'
          >Search</button>
        </form>


        {
          !auth?.user ? (
            <>
              <li className="nav-item">
                <NavLink className="nav-link" to="/login">LOGIN</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/register">REGISTER</NavLink>
              </li>
            </>
          ) : (
            <div className='dropdown'>

              <li>
                <a className='nav-link pointer dropdown-toggle' data-bs-toggle="dropdown">
                  { auth?.user.name }
                </a>
                <ul className='dropdown-menu'>
                  <li className="nav-item">
                    <NavLink
                      className="nav-link"
                      to={ `/dashboard/${ auth?.user?.role === 1 ? "admin" : "user" }` }
                    >
                      Dashboard
                    </NavLink>
                  </li>

                  <li className="nav-item">
                    <a onClick={ logout } className="nav-link pointer" >
                      Logout
                    </a>
                  </li>
                </ul>

              </li>
            </div>

          )
        }

      </ul>
    </>
  );
} 