import { useAuth } from '../../context/auth';


export default function UserCartSidebar ()
{

  

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
          <h4>Address:</h4>
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
  </div>;

}