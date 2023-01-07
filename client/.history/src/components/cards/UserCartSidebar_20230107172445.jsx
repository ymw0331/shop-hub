import { useState, useEffect } from 'react';
import { useAuth } from '../../context/auth';
import { useCart } from '../../context/cart';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DropIn from "braintree-web-drop-in-react";
import { toast } from 'react-hot-toast';

export default function UserCartSidebar ()
{
  //state 
  const [ clientToken, setClientToken ] = useState( "" );
  const [ instance, setInstance ] = useState( "" );
  

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

  const handlePurchase = async () =>
  {
    try
    {
      const { nonce } = await instance.requestPaymentMethod();
      // console.log( "nonce =>", nonce );

      const { data } = await axios.post( '/braintree/payment', {
        nonce, cart
      } );

      // console.log( "handled purcahse response =>", data );
      localStorage.removeItem( "cart" );
      setCart( [] );
      navigate( '/dashboard/user/orders' );
      toast.success( 'Payment successful' );

    } catch ( error )
    {
      console.log( error );
    }

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

      <div className='mt-3 ms-1 mb-5'>


        { !clientToken || !cart?.length ?
          ''
          :
          <>
            <DropIn
              options={ {
                authorization: clientToken,
                paypal: {
                  flow: "vault"
                }
              } }
              onInstance={ ( instance ) => setInstance( instance ) }
            />
          </> }


        <button
          onClick={ handlePurchase }
          className="btn btn-primary col-12 mt-2"
          disabled={ !auth?.user?.address || !instance }
        >
          Buy
        </button>
      </div>

    </div>
  );
}