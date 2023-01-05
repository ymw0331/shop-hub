import { useAuth } from '../../context/auth';
import Jumbotron from '../../components/cards/Jumbotron';


export default function AdminDashboard ()
{

  //context
  const [ auth, setAuth ] = useAuth();

  return (
    <>
      <Jumbotron
        title={ `Hello ${ auth?.user?.name }` }
        subTitle="Admin Dashboard"
      />

<pre/
    </>
  );
}