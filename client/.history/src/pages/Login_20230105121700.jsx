import { useState } from "react";
import Jumbotron from '../components/cards/Jumbotron';
import axios from 'axios';
import toast from "react-hot-toast";

export default function Login ()
{
  //state
  const [ email, setEmail ] = useState( 'wayne@gmail.com' );
  const [ password, setPassword ] = useState( 'wwwwwww' );

  // console.log( process.env.REACT_APP_API );

  const handleSubmit = async ( e ) =>
  {
    e.preventDefault();
    try
    {
      const { data } = await axios.post( `${ process.env.REACT_APP_API }/login`,
        {
          email,
          password
        } );
      console.log( data );

      if ( data?.error )
      {
        toast.error( data.error );
      } else
      {
        toast.success( "Login successful" );
      }

    } catch ( error )
    {
      console.log( error );
      toast.error( "Login failed. Please try again" );
    }
  };

  return (
    <div>
      <Jumbotron title="Login" />
      <div className="container mt-5 ">
        <div className="row">
          <div className="col-md-6 offset-md-3">
            <form onSubmit={ handleSubmit } >

              <input
                type="email"
                className="form-control mb-4 p-2"
                placeholder="Enter your email"
                value={ email }
                onChange={ ( e ) => setEmail( e.target.value ) }
              >
              </input>

              <input
                type="password"
                className="form-control mb-4 p-2"
                placeholder="Enter your password"
                value={ password }
                onChange={ ( e ) => setPassword( e.target.value ) }
              >
              </input>
              <button className="btn btn-primary" type="submit" onClick={ handleSubmit }>
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* <pre>{ JSON.stringify( name, null, 4 ) }</pre>
      <pre>{ JSON.stringify( email, null, 4 ) }</pre>
      <pre>{ JSON.stringify( password, null, 4 ) }</pre> */}
    </div>
  );
}

