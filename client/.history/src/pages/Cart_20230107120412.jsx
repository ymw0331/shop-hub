import { useAuth } from '../context/auth';
import { useCart } from '../context/cart';
import Jumbotron from '../components/cards/Jumbotron';
import { useNavigate } from 'react-router-dom';



export default function Cart ()
{
  //context
  const [ cart, setCart ] = useCart();
  const [ auth, setAuth ] = useAuth();

  //hooks
  const navigate = useNavigate();

  return (
<>

  
</>
  );
}