import { useEffect, useState } from 'react';
import { useAuth } from '../../context/auth';
import Jumbotron from '../../components/cards/Jumbotron';
import UserMenu from '../../components/nav/UserMenu';
import axios from 'axios';

export default function UserProfile ()
{
  //context
  const [ auth, setAuth ] = useAuth();

  //state
  const [ name, setName ] = useState( "" );
  const [ email, setEmail ] = useState( "" );
  const [ password, setPassword ] = useState( "" );
  const [ address, setAddress ] = useState( "" );

  useEffect( () =>
  {

    if ( auth?.user )
    {
      const { name, email, address } = auth.user;
      setName( name );
      setEmail( email );
      setAddress( address );
    }
  }, [ auth?.user ] );


  const handleSubmit = async ( e ) =>
  {
    try
    {
      const { data } = axios.put( `/profile`, {
        name,
        password,
        address,
      } );

      console.log( "profile updated => ", data );

    } catch ( error )
    {
      console.log( error );
    }
  };

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

            <form>
              
            </form>


          </div>

        </div>
      </div>

      {/* <pre>{ JSON.stringify( auth, null, 4 ) }</pre> */ }
    </>
  );
};