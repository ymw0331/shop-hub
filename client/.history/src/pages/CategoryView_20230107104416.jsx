import Jumbotron from '../components/cards/Jumbotron';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/cards/ProductCard';

export default function CategoryView ()
{
  //state
  const [ products, setProducts ] = useState( [] );
  const [ category, setCategory ] = useState( {} );

  //hooks
  const navigate = useNavigate();
  const params = useParams();

  useEffect( () =>
  {
    if ( params?.slug ) loadPoductsByCategory();
  }, [ params?.slug ] );

  const loadPoductsByCategory = async () =>
  {
    try
    {
      const { data } = await axios.get( `/products-by-category/${ params.slug }` );

      setCategory( data.category );
      setProducts( data.products );
      // console.log( data );
    } catch ( error )
    {
      console.log( error );
    }

  };
  // console.log( "params =>", params );

  return ( <>

    <Jumbotron
      title={ category?.name }
      subTitle=
      { `${ products.length === 1 ?
        `1 product found in ${ category.name }`
        :
        `${ products.length } products found in ${ category.name }`
        }` }
    />

    <div className='container-fluid'>
      <div className='row mt-3'>
        { products?.map( p =>
          <div key={ p._id } className="col-md-4">
            <ProductCard p={ p }></ProductCard>
          </div>
        ) }

      </div>
    </div>

  </> );
}