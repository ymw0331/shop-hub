export default function Jumbotron ( { title, subTitle = "Welcome to React E-Commerce" } )
{
  return
  ( <div className='container-fluid jumbotron'>
    <div className='row'>
      <div className='col text-center p-5 '>
        <h1>{ title }</h1>
        <p className='lead'>{ subTitle }</p>
      </div>
    </div>
  </div>
  );
}