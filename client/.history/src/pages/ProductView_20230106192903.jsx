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
    if ( params?.slug )
      loadProduct();

    // console.log( params );
  } );

  const loadProduct = aysnc( req, res ) => {
    try
    {
      //

    } catch ( error )
    {
      console.log( error );
    }
  }

  return (
    <div>

      Product View
    </div>
  );
}