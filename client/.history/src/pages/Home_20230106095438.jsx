import { useEffect } from 'react';
import { useAuth } from '../context/auth';
import axios from 'axios';
import Jumbotron from '../components/cards/Jumbotron';

export default function Home ()
{

  const [ auth, setAuth ] = useAuth();
  return (
    <div>
      <Jumbotron
        title="Hello World"
      />



    </div>
  );
}

