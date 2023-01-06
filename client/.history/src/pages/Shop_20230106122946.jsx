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
    loadProducts();
  }, [] );

  const loadProducts = async () =>
  {
    try
    {
      const { data } = await axios.get( "/products" );
      setProducts( data );
    } catch ( error )
    {
      console.log( error );
    }
  };

  useEffect( () =>
  {
    loadCategories();
  }, [] );

  const loadCategories = async () =>
  {
    try
    {
      const { data } = await axios.get( "/categories" );
      setCategories( data );
    } catch ( error )
    {
      console.log( error );
    }
  };

  return (

    <>
      <Jumbotron
        title="Hello World"
        subTitle='Welcome to React E-Commerce'
      />

      <div className='container-fluid'></div>

    </>

  );
}