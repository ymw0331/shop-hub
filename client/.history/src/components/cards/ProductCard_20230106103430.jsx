import moment from 'moment';

export default function ProductCard ( { p } )
{
  return (
    <div className='card mb-3' key={ p._id }>

      <img
        src={ `${ process.env.REACT_APP_API }/product/photo/${ p._id }` }
        alt={ p.name }
        style={ { height: '300px', objectFit: 'cover' } }
      />

      <div className='card-body'>

        <h5>{ p?.name }</h5>
        <p className='card-text'>{ p?.description?.substring( 0, 60 ) }</p>

      </div>

      <div className='d-flex justify-content-between'>

        
      </div>
      {/* 
      <p>{ moment( p.createdAt ).fromNow() }</p>
      <p>{ p.sold } sold</p> */}
    </div>
  );
}