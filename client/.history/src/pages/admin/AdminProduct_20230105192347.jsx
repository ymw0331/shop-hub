import { useState, useEffect } from 'react';
import { useAuth } from '../../context/auth';
import Jumbotron from '../../components/cards/Jumbotron';
import AdminMenu from '../../components/nav/AdminMenu';
import axios from 'axios';
import { Select } from 'antd';

const { Option } = Select;

export default function AdminProduct ()
{
  //context
  const [ auth, setAuth ] = useAuth();

  //state
  const [ categories, setCategories ] = useState( [] );
  const [ photo, setPhoto ] = useState( "" );
  const [ name, setName ] = useState( "" );
  const [ description, setDescription ] = useState( "" );
  const [ price, setPrice ] = useState( "" );
  const [ category, setCategory ] = useState( "" );
  const [ shipping, setShipping ] = useState( "" );
  const [ quantity, setQuantity ] = useState( "" );


  useEffect( () =>
  {
    loadCategories();
  } );

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

  return (
    <>
      <Jumbotron
        title={ `Hello ${ auth?.user?.name }` }
        subTitle="Admin Product"
      />

      <div className='container-fluid'>
        <div className='row'>
          {/* Sidebar */ }
          <div className='col-md-3'>
            <AdminMenu />
          </div>
          {/* Content */ }
          <div className='col-md-9'>
            <div className='p-3 mt-2 mb-2 h4 bg-light'>Create Product</div>

            <Select>
              { categories.map( ( c ) =>
              
                <Option
                  key={ c._id }
                  value={ c.name }>{ c.name }
                </Option>;
              } ) }
            </Select>

          </div>
        </div>
      </div>

      {/* <pre>{ JSON.stringify( auth, null, 4 ) }</pre> */ }
    </>
  );
};