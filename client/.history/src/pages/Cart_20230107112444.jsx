import { useCart } from '../context/cart';


export default function Cart ()
{
  //context
  const [ cart, setCart ] = useCart();


  return (
    <div>
      <h1>
        Cart Page
      </h1>
    </div>
  );
}