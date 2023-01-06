import { useSearch } from '../context/search';
import ProductCard from '../components/cards/ProductCard';
import Jumbotron from '../components/cards/Jumbotron';


export default function Search ()
{

  const [ values, setValues ] = useSearch();

  return (
    <>


      <Jumbotron
        title="Search results"
        subTitle={
          values?.results?.length < 1
            ? "No products found"
            : `Found ${ values?.results?.length } products`
        }
      />


      <div className='container mb-3'></div>

    </>

  );
}