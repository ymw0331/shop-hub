import { useEffect } from 'react';
import { useAuth } from '../../context/auth';
import Jumbotron from '../../components/cards/Jumbotron';
import UserMenu from '../../components/nav/UserMenu';
import { useEffect } from 'react';

export default function UserOrders ()
{
  //context
  const [ auth, setAuth ] = useAuth();

  useEffect( () =>
  {
    if ( auth ? token) getOrders();
    
} );


return (
  <>
    <Jumbotron
      title={ `Hello ${ auth?.user?.name }` }
      subTitle="User Orders"
    />

    <div className='container-fluid'>
      <div className='row'>
        {/* Sidebar */ }
        <div className='col-md-3'>
          <UserMenu />
        </div>
        {/* Content */ }
        <div className='col-md-9'>
          <div className='p-3 mt-2 mb-2 h4 bg-light'>Orders</div>
          user order history

        </div>

      </div>
    </div>

    {/* <pre>{ JSON.stringify( auth, null, 4 ) }</pre> */ }
  </>
);
};