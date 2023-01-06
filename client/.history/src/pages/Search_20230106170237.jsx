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
        subTitle={}
      />

    </>

  );
}