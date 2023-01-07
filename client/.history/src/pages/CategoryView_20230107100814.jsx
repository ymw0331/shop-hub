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

  console.log( params );

  return ( <div>
    <h1>Single Category View</h1>
  </div> );
}