import { useState, useEffect } from 'react';
import Jumbotron from '../components/cards/Jumbotron';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Badge } from 'antd';
import
{
  FaDollarSign, FaProjectDiagram, FaRegClock, FaCheck, FaTruckMoving,
  FaWarehouse, FaRocket
} from "react-icons/fa";


export default function ProductView ()
{
  //state
  const [ product, setProduct ] = useState( {} );
  //hook
  const params = useParams();

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
    } catch ( error )
    {
      console.log( error );
    }

  };


  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-md-9'>

          <div className='card mb-3 hoverable' key={ product._id }>
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

              <h4 className='fw-bold'>
                { product?.price?.toLocaleString( "en-SG", {
                  style: "currency",
                  currency: "SGD"
                } ) }
              </h4>

              <p className='card-text'>{ product?.description }</p>

            </div>

            <div className='d-flex justify-content-between' >
              <div>
<p></p>

              </div>

            </div>

            <button
              className='btn btn-outline-primary col card-button'
              style={ { borderBottomRightRadius: "5px" } }
            >
              Add To Cart
            </button>

            {/* 
              <p>{ moment( p.createdAt ).fromNow() }</p>
              <p>{ p.sold } sold</p> */}
          </div>

        </div>

        <div className='col-md-3'>
          <h2>Related Products</h2>

        </div>
      </div>

    </div>

  );
}