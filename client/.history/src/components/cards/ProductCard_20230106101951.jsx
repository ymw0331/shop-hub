import moment from 'moment';

export default function ProductCard ( { p } )
{
  return ( <div key={ p._id }>
    <p>{ p.name }</p>
    <p>{ moment( p.createdAt ).fromNow() }</p>
    <p>{ p.sold } sold</p>
  </div> );

}