import { useState, useEffect } from 'react';
import { useAuth } from '../../context/auth';
import Jumbotron from '../../components/cards/Jumbotron';
import AdminMenu from '../../components/nav/AdminMenu';
import axios from 'axios';
import toast from 'react-hot-toast';
import CategoryForm from '../../components/forms/CategoryForm';
import { Modal } from 'antd';


export default function AdminCategory ()
{
  //context
  const [ auth, setAuth ] = useAuth();

  //state
  const [ name, setName ] = useState( "" );
  const [ categories, setCategories ] = useState( [] );
  const [ visible, setVisible ] = useState( false );
  const [ selected, setSelected ] = useState( null );
  const [ updatingName, setUpdatingName ] = useState( "" );


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
        loadCategories();
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

  const handleUpdate = async ( e ) => 
  {
    e.preventDefault();
    try
    {
      const { data } = await axios.put( `/category/${ selected._id }`,
        { name: updatingName } );

      if ( data?.error )
      {
        toast.error( data.error );
      }
      else
      {
        toast.success( `${ data.name } is updated` );
        setSelected(null)
      }

      // console.log( 'update category => ', updatingName );
    } catch ( error )
    {
      console.log( error );
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

            <CategoryForm
              value={ name }
              setValue={ setName }
              handleSubmit={ handleSubmit }
              placeholder={ "Write category name" }
            />

            <hr />

            <div className='col'>
              { categories?.map( ( c ) =>
                <button key={ c._id }
                  className='btn btn-outline-primary m-3 '
                  onClick={ () =>
                  {
                    setVisible( true );
                    setSelected( c );
                    setUpdatingName( c.name );
                  } }>
                  { c.name }
                </button>
              ) }
            </div>

            <Modal
              open={ visible }
              onOk={ () => setVisible( false ) }
              onCancel={ () => setVisible( false ) }
              footer={ null }
            >
              <CategoryForm
                value={ updatingName }
                setValue={ setUpdatingName }
                handleSubmit={ handleUpdate }
                placeholder={ "Write category name" } />

            </Modal>
          </div>


        </div>
      </div>

      {/* <pre>{ JSON.stringify( auth, null, 4 ) }</pre> */ }
    </>
  );
};