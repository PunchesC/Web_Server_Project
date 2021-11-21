const User = require('../model/User');




const handleLogout = async (req, res) => {
  // Needs to be done on FRONTEND On client, also delete the accessToken, needs to be done in the memory of the client application.



  const cookies = req.cookies;
  // Below is checking if a cookie contains JWT property
  if(!cookies?.jwt) return res.sendStatus(204); // No content
  
  const refreshToken = cookies.jwt;

  // Is refreshToken in db?


  const foundUser = await User.findOne({refreshToken}).exec();
  if(!foundUser) {
    res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', source:true});
    return res.sendStatus(204); // No content
  }
  
  // Delete refreshToken in db 
  foundUser.refreshToken = '';
  const result = await foundUser.save();
  console.log(result);

  res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', source:true}); // secure: true - only serves on https to place in Production Code
  res.sendStatus(204);
}
 

module.exports = { handleLogout};