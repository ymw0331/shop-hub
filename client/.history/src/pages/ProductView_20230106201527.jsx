import { useState, useEffect } from 'react';
import Jumbotron from '../components/cards/Jumbotron';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Badge } from 'antd';


export default function ProductView ( { p } )
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
    <div className='card mb-3 hoverable' key={ p._id }>
      <Badge.Ribbon text={ `${ p?.sold } sold` } color="red">
        <Badge.Ribbon
          text={ `${ p?.quantity >= 1 ? `${ p?.quantity - p?.sold } in stock` : "Out of Stock" }` }
          placement="start"
          color="green"
        >
          <img
            className='card-img-top'
            src={ `${ process.env.REACT_APP_API }/product/photo/${ p._id }` }
            alt={ p.name }
            style={ { height: '300px', objectFit: 'cover' } }
          />
        </Badge.Ribbon>
      </Badge.Ribbon>

      <div className='card-body'>
        <h5>{ p?.name }</h5>

        <h4 className='fw-bold'>
          { p?.price?.toLocaleString( "en-SG", {
            style: "currency",
            currency: "SGD"
          } ) }
        </h4>

        <p className='card-text'>{ p?.description }...</p>

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
  );
}