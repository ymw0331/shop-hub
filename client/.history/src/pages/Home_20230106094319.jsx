import { useEffect } from 'react';
import { useAuth } from '../context/auth';
import Jumbotron from '../components/cards/Jumbotron';
import axios from 'axios';

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

