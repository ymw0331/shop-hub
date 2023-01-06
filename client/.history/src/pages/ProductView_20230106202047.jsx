import { useState, useEffect } from 'react';
import Jumbotron from '../components/cards/Jumbotron';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Badge } from 'antd';


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
  }, [ params?.slug ] );


  const loadProduct = async ( req, res ) =>
  {
    try
    {
      const { data } = await axios.get( `/product/${ params.slug }` );
      setProduct( data );
    } catch ( error )
    {
      console.log( error );
    }

  };


  return (
    <div className='container-fluid'>
      <div className='row'>



      </div>

    </div>

  );
}