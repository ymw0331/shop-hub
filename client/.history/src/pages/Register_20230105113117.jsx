import { useState } from "react";
import Jumbotron from '../components/cards/Jumbotron';

export default function Register ()
{
  //state
  const [ name, setName ] = useState( '' );

  return (
    <div>
      <Jumbotron title="Register" />
    </div>
  );
}

