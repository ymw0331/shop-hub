import { useState, useEffect } from 'react';
import Jumbotron from '../components/cards/Jumbotron';
import axios from 'axios';
import ProductCard from '../components/cards/ProductCard';


export default function Shop ()
{
  const [ categories, setCategories ] = useState( [] );
  const [ products, setProducts ] = useState( [] );

  useEffect( () =>
  {

  },[] );

  return (
    <div>
      Shop Page

    </div>

  );
}