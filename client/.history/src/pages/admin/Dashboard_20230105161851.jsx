import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/auth';
import Jumbotron from '../../components/cards/Jumbotron';

export default function AdminDashboard ()
{

  //context
  const [ auth, setAuth ] = useAuth();

  return (
    <>
      <Jumbotron
        title={ `Hello ${ auth?.user?.name }` }
        subTitle="Admin Dashboard"
      />

      <div className='container-fluid'>
        <div className='row'>
          <div className='col-md-3'>
            <div className='p-3 mt-2 mb-2 h4 bg-light'>Admin Links</div>
            <ul className='list-group list-unst'>
              <li>
                <NavLink
                  className="list-group-item"
                  to="/dashboard/admin/category" >
                  Create Category
                </NavLink>
              </li>

            </ul>
          </div>
          <div className='col-md-9'>Content</div>

        </div>
      </div>

      {/* <pre>{ JSON.stringify( auth, null, 4 ) }</pre> */ }
    </>
  );
};