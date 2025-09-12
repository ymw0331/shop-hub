import moment from 'moment';
import { useCart } from '../../context/cart.js';

export default function ProductCardHorizontal ( { p, remove = true } )
{
  //context
  const [ cart, setCart ] = useCart();

  const removeFromCart = async ( productId ) =>
  {
    let myCart = [ ...cart ];
    let index = myCart.findIndex( ( item ) => item._id === productId );
    myCart.splice( index, 1 );
    setCart( myCart );
    localStorage.setItem( 'cart', JSON.stringify( myCart ) );
  };

  return (
    <div className='rounded-lg shadow-md mb-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden'>
      <div className='flex'>
        <div className='w-1/3 md:w-1/4'>
          <img
            src={ `${ process.env.REACT_APP_API }/product/photo/${ p._id }` }
            alt={ p.name }
            className='w-full h-36 object-cover'
          />
        </div>

        <div className='flex-1 p-4'>
          <div className='text-gray-900 dark:text-gray-100'>
            <h5 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1'>
              { p.name } { " " }
              <span className='text-indigo-600 dark:text-indigo-400'>
                { p?.price?.toLocaleString( "en-SG", {
                  style: "currency",
                  currency: "SGD"
                } ) }
              </span>
            </h5>
            <p className='text-sm text-gray-600 dark:text-gray-400 mb-3'>
              { `${ p.description?.substring( 0, 50 ) }...` }
            </p>

            <div className='flex justify-between items-center'>
              <p className='text-xs text-gray-500 dark:text-gray-400'>
                Listed { moment( p.createdAt ).fromNow() }
              </p>
              { remove &&
                ( <button 
                    className='text-red-500 dark:text-red-400 text-sm font-medium hover:text-red-600 dark:hover:text-red-300 transition-colors cursor-pointer'
                    onClick={ () => removeFromCart( p._id ) }
                  >
                    Remove
                  </button> )
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}