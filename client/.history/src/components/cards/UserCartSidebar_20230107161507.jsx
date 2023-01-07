import { useState, useEffect } from 'react';
import { useAuth } from '../../context/auth';
import { useCart } from '../../context/cart';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DropIn from "braintree-web-drop-in-react";

export default function UserCartSidebar ()
{
  //state 
  const [ clientToken, setClientToken ] = useState( "" );

  //context
  const [ auth, setAuth ] = useAuth();
  const [ cart, setCart ] = useCart();

  //hooks
  const navigate = useNavigate();

  useEffect( () =>
  {
    if ( auth?.token )
    {
      getClientToken();
    }

  }, [ auth?.token ] );


  const getClientToken = async () =>
  {
    try
    {
      const { data } = await axios.get( '/braintree/token' );
      setClientToken( data.clientToken );

    } catch ( error )
    {
      console.log( error );
    }

  };

  const cartTotal = () =>
  {
    let total = 0;
    cart.map( ( item ) =>
    {
      total += item.price;
    } );
    return total.toLocaleString( "en-SG", {
      style: "currency",
      currency: "SGD"
    } );

  };

  return (
    <div className='col-md-4'>

      <h4>Your cart summary</h4>
      Total/Address/Payments
      <hr />
      <h6>Total: { cartTotal() }</h6>

      {/* check if user has addres */ }
      { auth?.user?.address ? (
        <>
          <div className='mb-3'>
            <hr />
            <h4>Delivery Address:</h4>
            <h5>{ auth?.user?.address }</h5>

          </div>
          <button className='btn btn-outline-warning'
            onClick={ () => navigate( '/dashboard/user/profile' ) }>
            Update address
          </button>
        </>

      ) : <div className='mb-3'>
        {/* check if user loggin */ }
        { auth?.token ?
          (
            <button className='btn btn-outline-warning'
              onClick={ () => navigate( '/dashboard/user/profile' ) }>Add delivery address
            </button>
          )
          :
          (
            <button className='btn btn-outline-danger mt-3'
              onClick={ () =>
                navigate( '/login', {
                  state: '/cart' //use location hook to redirect after login
                } ) }>
              Login to checkout
            </button>
          )
        }

      </div> }

      <div><DropIn 
      options={{
          authorization: clientToken
        }} /></div>

    </div>
  );
}