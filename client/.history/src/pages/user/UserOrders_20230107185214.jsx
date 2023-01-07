import { useEffect, useState } from 'react';
import { useAuth } from '../../context/auth';
import Jumbotron from '../../components/cards/Jumbotron';
import UserMenu from '../../components/nav/UserMenu';
import axios from 'axios';
import ProductCardHorizontal from '../../components/cards/ProductCardHorizontal';
import moment from "moment";

export default function UserOrders ()
{
  //context
  const [ auth, setAuth ] = useAuth();
  //state
  const [ orders, setOrders ] = useState( "" );

  useEffect( () =>
  {
    if ( auth?.token ) getOrders();
  }, [ auth?.token ] );

  const getOrders = async () =>
  {
    try
    {
      const { data } = await axios.get( "/orders" );
      setOrders( data );
    } catch ( err )
    {
      console.log( err );
    }
  };

  return (
    <>
      <Jumbotron title={ `Hello ${ auth?.user?.name }` } subTitle="Dashboard" />

      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <div className="p-3 mt-2 mb-2 h4 bg-light">Orders</div>

            {
              orders.map( ( o, i ) =>
              {
                return (
                  <div>

                    
                  </div>
                );


              } )

            }

          </div>
        </div>
      </div>
    </>
  );
};