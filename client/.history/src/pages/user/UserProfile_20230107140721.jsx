import { useState } from 'react';
import { useAuth } from '../../context/auth';
import Jumbotron from '../../components/cards/Jumbotron';
import UserMenu from '../../components/nav/UserMenu';

export default function UserProfile ()
{
  //context
  const [ auth, setAuth ] = useAuth();

  //state
  const [ name, setName ] = useState( "" );
  const [ email, setName ] = useState( "" );
  const [ name, setName ] = useState( "" );
  const [ name, setName ] = useState( "" );
  const [ name, setName ] = useState( "" );

  return (
    <>
      <Jumbotron
        title={ `Hello ${ auth?.user?.name }` }
        subTitle="User Profile"
      />

      <div className='container-fluid'>
        <div className='row'>
          {/* Sidebar */ }
          <div className='col-md-3'>
            <UserMenu />
          </div>
          {/* Content */ }
          <div className='col-md-9'>
            <div className='p-3 mt-2 mb-2 h4 bg-light'>Profile</div>
            update form

          </div>

        </div>
      </div>

      {/* <pre>{ JSON.stringify( auth, null, 4 ) }</pre> */ }
    </>
  );
};