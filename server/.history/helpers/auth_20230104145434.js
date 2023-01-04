import bcrypt from "bcrypt";

//hash password from plain user registration
export const hashPassword = ( password ) =>
{
  return new Promise( ( resolve, reject ) =>
  {
    bcrypt.genSalt( 12, ( err, salt ) =>
    {
      if ( err )
      {
        reject( err );
      }
      bcrypt.hash( password, salt, ( err, hash ) =>
      {
if(err)
      } );
    } );

  } );
};

//compare password when user login
export const comparePassword = ( password ) =>
{

};

