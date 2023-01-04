import bcrypt from "bcrypt";

//hash password from plain user registration
export const hashPassword = ( password ) =>
{
  return new Promise( ( resolve, reject ) =>
  {
    bcrypt.genSalt( 12, ( err, salt ) =>{
      
    } );

  } );
};

//compare password when user login
export const comparePassword = ( password ) =>
{

};

