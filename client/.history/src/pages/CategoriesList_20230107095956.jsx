import { useCategory from './../hooks/useCategory.js';
import Jumbotron from '../components/cards/Jumbotron';
import { Link } from 'react-router-dom';

export default function CategoriesList ()
{
  const categories = useCategory();

  return ( <div>

    <Jumbotron
      title="Categories" subtitle="List of all cateoris"

    />

  </div> );
}