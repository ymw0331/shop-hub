import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Badge } from 'antd';
import
{
  FaDollarSign, FaProjectDiagram, FaRegClock, FaCheck,
  FaWarehouse, FaRocket, FaTimes
} from "react-icons/fa";

import moment from 'moment';
import ProductCard from '../components/cards/ProductCard';
import { useCart } from '../context/cart.js';
import { toast } from 'react-hot-toast';


export default function ProductView ()
{
  //state
  const [ product, setProduct ] = useState( {} );
  const [ related, setRelated ] = useState( [] );
  //hook
  const params = useParams();
  //context
  const [ cart, setCart ] = useCart();

  useEffect( () =>
  {
    if ( params?.slug )
      loadProduct();
    // console.log( params );
  }, [ params?.slug ] );


  const loadProduct = async ( req, res ) =>
  {
    try
    {
      const { data } = await axios.get( `/product/${ params.slug }` );
      setProduct( data );
      loadRelated( data._id, data.category._id );
    } catch ( error )
    {
      console.log( error );
    }
  };

  const loadRelated = async ( productId, categoryId ) =>
  {
    try
    {
      const { data } = await axios.get(
        `/related-products/${ productId }/${ categoryId }`
      );
      setRelated( data );
    } catch ( err )
    {
      console.log( err );
    }
  };

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-md-9'>

          <div className='card mb-3' key={ product._id }>
            <Badge.Ribbon text={ `${ product?.sold } sold` } color="red">
              <Badge.Ribbon
                text={ `${ product?.quantity >= 1 ? `${ product?.quantity - product?.sold } in stock` : "Out of Stock" }` }
                placement="start"
                color="green"
              >
                <img
                  className='card-img-top'
                  src={ `${ process.env.REACT_APP_API }/product/photo/${ product._id }` }
                  alt={ product.name }
                  style={ { height: '500px', width: '100%', objectFit: 'cover' } }
                />
              </Badge.Ribbon>
            </Badge.Ribbon>

            <div className='card-body'>
              <h1 className='fw-bold'>
                { product?.name }</h1>

              <p className='card-text lead'>{ product?.description }</p>

            </div>

            <div className='d-flex justify-content-between fw-bold' >

              <div className='fw-bold lead p-5 bg-light'>

                <p>
                  <FaDollarSign />Price:{ "" }
                  { product?.price?.toLocaleString( "en-SG", {
                    style: "currency",
                    currency: "SGD"
                  } ) }
                </p>

                <p>
                  <FaProjectDiagram />
                  Category:{ "" }{ product?.category?.name }
                </p>

                <p>
                  <FaRegClock />
                  Added:{ "" }{ moment( product.createdAt ).fromNow() }
                </p>

                <p>
                  { product?.quantity > 0 ? <FaCheck /> : <FaTimes /> }
                  { product?.quantity > 0 ? "In Stock" : "Out of Stock" }
                </p>

                <p>
                  <FaWarehouse /> { "" } Available: { product?.quantity - product?.sold }
                </p>

                <p>
                  <FaRocket />{ "" } Sold: { product.sold }
                </p>

              </div>
            </div>

            <button
              className='btn btn-outline-primary col card-button'
              style={ { borderBottomRightRadius: "5px" } }
              onClick={ () =>
              {
                setCart( [ ...cart, product ] );
                toast.success( 'Added to cart' );
              } }
            >
              Add To Cart
            </button>

          </div>

        </div>

        <div className='col-md-3'>
          <h2>Related Products</h2>
          {/* <pre>{ JSON.stringify( related, null, 4 ) }</pre> */ }

          <hr />
          { related?.length < 1 && <p>Nothing Found</p> }
          { related?.map( ( p ) =>
            <ProductCard p={ p } key={ p._id } />
          ) }
        </div>
      </div>
    </div>

  );
}