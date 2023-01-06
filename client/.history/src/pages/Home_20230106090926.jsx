// import { AuthContext } from '../context/auth';
// import { useContext } from 'react';
import { useEffect } from 'react';
import Jumbotron from '../components/cards/Jumbotron';
import { useAuth } from '../context/auth';
import axios from 'axios';

export default function Home ()
{
  // const [ auth, setAuth ] = useContext( AuthContext );
  const [ auth, setAuth ] = useAuth();
  return (
    <div>
      <Jumbotron 
      title="Hello World" subTitle="This is home page" />
    </div>
  );
}

