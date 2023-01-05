export default function CategoryForm ( { value, setValue, handleSubmit, placeholder, buttonText } )
{
  return ( <div className='p-3'>
    <form onSubmit={ handleSubmit }>
      <input
        type="text"
        className='form-control p-3'
        placeholder={ placeholder }
        value={ value }
        onChange={ ( e ) => setValue( e.target.value ) }
      />
      <div className='d-flex justify-content-between'>

      </div>

    </form>

  </div> );
}