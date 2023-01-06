import Jumbotron from '../components/cards/Jumbotron';
// import { AuthContext } from '../context/auth';
// import { useContext } from 'react';
import { useAuth } from '../context/auth';


export default function Home ()
{
  // const [ auth, setAuth ] = useContext( AuthContext );
  const [ auth, setAuth ] = useAuth();
  return (
    <div>
      <Jumbotron title="Hello World" subTitle="This is home page" />
    </div>
  );
}

