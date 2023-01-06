import { useState, useEffect } from 'react';
import Jumbotron from '../components/cards/Jumbotron';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function ProductView ()
{
  //state
  const [ product, setProduct ] = useState( {} );
  //hook
  const params = useParams();

  useEffect( () =>
  {
loadProducts

    // console.log( params );
  } );

  return (
    <div>

      Product View
    </div>
  );
}