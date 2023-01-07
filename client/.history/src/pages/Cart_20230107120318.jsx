import { useCart } from '../context/cart';
import Jumbotron from '../components/cards/Jumbotron';
import { useNavigate } from 'react-router-dom';



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