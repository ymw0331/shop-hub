import { useState, useEffect } from 'react';
import { useAuth } from '../../context/auth';
import Jumbotron from '../../components/cards/Jumbotron';
import AdminMenu from '../../components/nav/AdminMenu';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function AdminCategory ()
{
  //context
  const [ auth, setAuth ] = useAuth();

  //state
  const [ name, setName ] = useState();
  const [ categories, setCategories ] = useState( [] );

  useEffect( () =>
  {
    loadCategories();
  }, [] );


  const loadCategories = async ( e ) =>
  {
    try
    {
      const { data } = await axios.get( "/categories" );
      setCategories( data );

    } catch ( err )
    {
      console.log( err );
    }
  };

  const handleSubmit = async ( e ) =>
  {
    e.preventDefault();
    try
    {
      const { data } = await axios.post( "/category", { name } );
      if ( data?.error )
      {
        toast.error( data.error );
      }
      else
      {
        setName( "" );
        toast.success( `"${ data.name }" is created` );
      }


      // console.log( "post this category => ", name );
    } catch ( err )
    {
      console.log( err );
      toast.error( "Create category failed. Please try again" );
    }
  };

  return (
    <>
      <Jumbotron
        title={ `Hello ${ auth?.user?.name }` }
        subTitle="Admin Category"
      />

      <div className='container-fluid'>
        <div className='row'>
          {/* Sidebar */ }
          <div className='col-md-3'>
            <AdminMenu />
          </div>
          {/* Content */ }
          <div className='col-md-9'>
            <div className='p-3 mt-2 mb-2 h4 bg-light'>Manage Categories</div>

            <div className='p-3'>
              <form onSubmit={ handleSubmit }>
                <input
                  type="text"
                  className='form-control p-3'
                  placeholder='Write category name'
                  value={ name }
                  onChange={ ( e ) => setName( e.target.value ) }
                />
                <button className='btn btn-primary mt-3'>Submit</button>
              </form>
              <div className='col'>

                { categories?.map( ( c ) => <div key={ c._id }>
                  <button className='btn btn-outline-primary m-3'>

                  </button>
                </div> ) }
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* <pre>{ JSON.stringify( auth, null, 4 ) }</pre> */ }
    </>
  );
};