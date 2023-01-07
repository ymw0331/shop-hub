import Jumbotron from '../components/cards/Jumbotron';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function CategoryView ()
{
  //state
  const [ products, setProducts ] = useState( [] );

  //hooks
  const navigate = useNavigate();
  const params = useParams();

  useEffect( () =>
  {
    loadPoductsByCategory();
  } );

  const loadPoductsByCategory = async () =>
  {
    try
    {
      const { data } = await axios.get( `/products-by-category` );

    } catch ( error )
    {
      console.log( error );

    }

  };
  console.log( "params =>", params );

  return ( <div>

    <Jumbotron
      title="Category"
      subTitle='X producs found in category'
    />
    <h1>Single Category View</h1>
  </div> );
}