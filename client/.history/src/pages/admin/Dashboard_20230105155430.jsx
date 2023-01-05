import { useAuth } from '../../context/auth';
import Jumbotron from '../../components/cards/Jumbotron';


export default function AdminDashboard ()
{

  //context
  const [ auth, setAuth ] = useAuth();

  return (

    <h2>Admin dashboard</h2>
  );
}