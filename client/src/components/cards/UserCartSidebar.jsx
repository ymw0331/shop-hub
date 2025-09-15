import { useEffect, useState } from "react";
import { useAuth } from "../../context/auth";
import { useCart } from "../../context/cart";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DropIn from "braintree-web-drop-in-react";
import toast from "react-hot-toast";

export default function UserCartSidebar ()
{
  // context
  const [ auth, setAuth ] = useAuth();
  const [ cart, setCart ] = useCart();
  // state
  const [ clientToken, setClientToken ] = useState( "" );
  const [ instance, setInstance ] = useState( "" );
  const [ loading, setLoading ] = useState( false );
  // hooks
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
      const { data } = await axios.get( `/braintree/getToken` );
      setClientToken( data.clientToken );
    } catch ( err )
    {
      console.log( err );
    }
  };

  const cartTotal = () =>
  {
    let total = 0;
    cart.map( ( item ) =>
    {
      total += item.price;
    } );
    return total.toLocaleString( "en-US", {
      style: "currency",
      currency: "USD",
    } );
  };

  const handleBuy = async () =>
  {
    try
    {
      setLoading( true );
      const { nonce } = await instance.requestPaymentMethod();
      //   console.log("nonce => ", nonce);
      const { data } = await axios.post( `/braintree/payment`, {
        nonce,
        cart,
      } );
      //   console.log("handle buy response => ", data);
      setLoading( false );
      localStorage.removeItem( "cart" );
      setCart( [] );
      navigate( "/dashboard/user/orders" );
      toast.success( "Payment successful" );
    } catch ( err )
    {
      console.log( err );
      toast.error( "Payment error: " + err );

      setLoading( false );
    }
  };

  return (
    <div className="w-full md:w-1/3 mb-5 text-gray-900 dark:text-gray-100">
      <h4 className="text-gray-900 dark:text-gray-100">Your cart summary</h4>
      <span className="text-gray-600 dark:text-gray-400">Total / Address / Payments</span>
      <hr />
      <h6 className="text-gray-900 dark:text-gray-100">Total: { cartTotal() }</h6>
      { auth?.user?.address ? (
        <>
          <div className="mb-3">
            <hr />
            <h4 className="text-gray-900 dark:text-gray-100">Delivery address:</h4>
            <h5 className="text-gray-700 dark:text-gray-300">{ auth?.user?.address }</h5>
          </div>
          <button
            className="px-4 py-2 border border-yellow-600 text-yellow-600 dark:text-yellow-400 dark:border-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/30 rounded-md font-medium transition-colors"
            onClick={ () => navigate( "/dashboard/user/profile" ) }
          >
            Update address
          </button>
        </>
      ) : (
        <div className="mb-3">
          { auth?.token ? (
            <button
              className="px-4 py-2 border border-yellow-600 text-yellow-600 dark:text-yellow-400 dark:border-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/30 rounded-md font-medium transition-colors"
              onClick={ () => navigate( "/dashboard/user/profile" ) }
            >
              Add delivery address
            </button>
          ) : (
            <button
              className="px-4 py-2 mt-3 border border-red-600 text-red-600 dark:text-red-400 dark:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md font-medium transition-colors"
              onClick={ () =>
                navigate( "/login", {
                  state: "/cart",
                } )
              }
            >
              Login to checkout
            </button>
          ) }
        </div>
      ) }
      <div className="mt-3">
        { !clientToken || !cart?.length ? (
          ""
        ) : (
          <>
            <DropIn
              options={ {
                authorization: clientToken,
                paypal: {
                  flow: "vault",
                },
              } }
              onInstance={ ( instance ) => setInstance( instance ) }
            />
            <button
              onClick={ handleBuy }
              className="w-full px-4 py-2 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={ !auth?.user?.address || !instance || loading }
            >
              { loading ? "Processing..." : "Purchase" }
            </button>
          </>
        ) }
      </div>
    </div>
  );
}
