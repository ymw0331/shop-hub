import { useCart } from '../context/cart';


export default function Cart ()
{
  //context
  const [ cart, setCart ] = useCart();

  return (

    <h1> Cart Page
      { cart.length }
    </h1>
  );
}