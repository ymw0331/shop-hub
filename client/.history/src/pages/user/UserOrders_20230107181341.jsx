import { useEffect, useState } from 'react';
import { useAuth } from '../../context/auth';
import Jumbotron from '../../components/cards/Jumbotron';
import UserMenu from '../../components/nav/UserMenu';
import axios from 'axios';
import ProductCardHorizontal from '../../components/cards/ProductCardHorizontal';

export default function UserOrders ()
{
  //state
  const [ orders, setOrders ] = useState( "" );

  //context
  const [ auth, setAuth ] = useAuth();

  useEffect( () =>
  {
    if ( auth?.token ) getOrders();

  }, [ auth?.token ] );

  const getOrders = async () =>
  {
    try
    {
      const { data } = await axios.get( '/orders' );
      setOrders( data );
    } catch ( error )
    {
      console.log( error );
    }
  };

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
            {/* <pre>{ JSON.stringify( orders, null, 4 ) }</pre> */ }
            <div className='row'>


              {
                orders?.map( ( o, i ) =>
                {
                  return (
                    <div
                      key={ o._id }
                      className="border shadow bg-light rounded-4 mb-5"
                    >
                      <table className='table'>
                        <thead>
                          <tr>
                            <th scope="col">#</th>
                            <th scope="col">Status</th>
                            <th scope="col">Purchaser</th>
                            <th scope="col">Ordered</th>
                            <th scope="col">Payment</th>
                            <th scope="col">Quantity</th>
                          </tr>
                        </thead>

                        <tbody>
                          


                        </tbody>

                      </table>

                    </div>
                  );
                } )
              }

            </div>

          </div>

        </div>
      </div>

    </>
  );
};