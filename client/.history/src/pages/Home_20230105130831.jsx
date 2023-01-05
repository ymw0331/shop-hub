import Jumbotron from '../components/cards/Jumbotron';
import { AuthContext } from '../context/auth';
import { useContext } from 'react';

export default function Home ()
{
  const [ auth, setAuth] = useContext
  return (
    <div>
      <Jumbotron title="Hello World" subTitle="This is home page" />
    </div>
  );  
}

