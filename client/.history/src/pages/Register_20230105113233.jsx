import { useState } from "react";
import Jumbotron from '../components/cards/Jumbotron';

export default function Register ()
{
  //state
  const [ name, setName ] = useState( '' );
  const [ email, setEmail ] = useState( '' );
  const [ password, setPassword ] = useState( '' );

  return (
    <div>
      <Jumbotron title="Register" />

      <div className="container">

        <div className="row">



        </div>

      </div>


    </div>
  );
}

