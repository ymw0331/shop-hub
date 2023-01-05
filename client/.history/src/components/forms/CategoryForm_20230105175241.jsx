export default function CategoryForm ( { value, setValue, handleSubmit, placeholder , buttonText} )
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
      <button className='btn btn-primary mt-3'>{buttonText}</button>
      <button className='btn btn-primary mt-3'>{buttonText}</button>

    </form>

  </div> );
}