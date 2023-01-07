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

            <form onSubmit={ handleSubmit }>

              <input
                type="text"
                className="form-control m-2 p-2"
                placeholder="Enter your name"
                value={ name }
                onChange={ ( e ) => setName( e.target.value ) }
                autoFocus={ true }
              />
              <input
                type="email"
                className="form-control m-2 p-2"
                placeholder="Enter your email"
                value={ email }
                disabled
                onChange={ ( e ) => setEmail( e.target.value ) }
              />
              <input
                type="password"
                className="form-control m-2 p-2"
                placeholder="Enter your password"
                value={ password }
                onChange={ ( e ) => setPassword( e.target.value ) }
              />

              <textarea
                className="form-control m-2 p-2"
                placeholder='Enter you address'
                value={ address }
                onChange={ ( e ) => setAddress( e.target.value ) }

              />

              <button className='btn btn-primary m-2 p-2'>
                Submit
              </button>
            </form>


          </div>

        </div>
      </div>

      {/* <pre>{ JSON.stringify( auth, null, 4 ) }</pre> */ }
    </>
  );
};