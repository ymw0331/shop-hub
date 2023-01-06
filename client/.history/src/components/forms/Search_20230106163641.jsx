export defatul Search() {


  return (


    <form className='d-flex'>
      <input
        type="search"
        style={ { borderRadius: "0px" } }
        className="form-control"
        placeholder="Search"
      />

      <button
        className='btn btn-outline-primary'
        style={ { borderRadius: "0px" } }
        type='submit'
      >Search
      </button>
    </form>
  );
}