import { useCategory } from './../hooks/useCategory';
import Jumbotron from '../components/cards/Jumbotron';


export default function CategoriesList ()
{
  const categories = useCategory();

  return ( <div>

    <h1>Show categories</h1>

  </div> );
}