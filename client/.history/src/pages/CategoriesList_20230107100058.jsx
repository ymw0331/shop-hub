import useCategory from './../hooks/useCategory.js';
import Jumbotron from '../components/cards/Jumbotron';
import { Link } from 'react-router-dom';

export default function CategoriesList ()
{
  const categories = useCategory();

  return (

    <>
      <Jumbotron
        title="Categories" subTitle="List of all categories"
      />

      <div>

        
      </div>




    </>
  );
}