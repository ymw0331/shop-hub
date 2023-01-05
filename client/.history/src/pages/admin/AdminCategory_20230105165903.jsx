import { useAuth, useState } from '../../context/auth';
import Jumbotron from '../../components/cards/Jumbotron';
import AdminMenu from '../../components/nav/AdminMenu';

export default function AdminCategory ()
{
  //context
  const [ auth, setAuth ] = useAuth();

  //state
  const [ name, setName ] = useState();

  const handleSubmit = async ( e ) =>
  {
    e.preventDefault();
    try
    {
      console.log( "post this category => ", name );
    } catch ( err )
    {
      console.log( err );
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

              <form>
                <input
                  type="text"
                  className='form-control p-3'
                  placeholder='Write category name'
                  value={}
                ></input>

              </form>
            </div>

          </div>

        </div>
      </div>

      {/* <pre>{ JSON.stringify( auth, null, 4 ) }</pre> */ }
    </>
  );
};