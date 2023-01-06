import moment from 'moment';

export default function ProductCard ( { p } )
{
  return (
    <div className='card mb-3' key={ p._id }>

      <img
        src={ `${ process.env.REACT_APP_API }/product/photo/${ p._id }` }
        alt={ p.name }
        style={ { height: '200px', objectFit: 'cover' } }
      />
      <p>{ p.name }</p>
      <p>{ moment( p.createdAt ).fromNow() }</p>
      <p>{ p.sold } sold</p>
    </div>
  );
}