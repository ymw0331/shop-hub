import { useAuth } from '../../context/auth';
import Jumbotron from '../../components/cards/Jumbotron';


export default function UserDashboard ()
{

  //context
  const [ auth, setAuth ] = useAuth();

  return (
    <>
      <Jumbotron
        title={ `Hello ${ auth?.user?.name }` }
        subTitle="User Dashboard"
      />

      <pre>{ JSON.stringify( auth, null, 4 ) }</pre>
    </>
  );
}