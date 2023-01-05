export default function CategoryForm ( { value setValue, handleSubmit } )
{
  return ( <div className='p-3'>
    <form onSubmit={ handleSubmit }>
      <input
        type="text"
        className='form-control p-3'
        placeholder='Write category name'
        value={ name }
        onChange={ ( e ) => setName( e.target.value ) }
      />
      <button className='btn btn-primary mt-3'>Submit</button>
    </form>

  </div> );
}