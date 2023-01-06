import moment from 'moment';
import { Badge } from 'antd';

export default function ProductCard ( { p } )
{
  return (
    <div className='card mb-3 hoverable' key={ p._id }>

      <Badge.Ribbon text={ `${ p?.sold } sold` } color="red">
        <Badge.Ribbon text={`p?.quantity >= 1 '`}>
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
        <p className='card-text'>{ p?.description?.substring( 0, 60 ) }</p>

      </div>

      <div className='d-flex justify-content-between'>
        <button
          className='btn btn-primary col card-button'
          style={ { borderBottomLeftRadius: "5px" } }
        >
          View Product
        </button>
        <button
          className='btn btn-outline-primary col card-button'
          style={ { borderBottomRightRadius: "5px" } }
        >
          Add To Cart
        </button>
      </div>



      {/* 
      <p>{ moment( p.createdAt ).fromNow() }</p>
      <p>{ p.sold } sold</p> */}
    </div>
  );
}