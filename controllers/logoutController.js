const usersDB = {
  users: require('../model/users.json'),
  setUsers: function (data) {this.users = data}
}

const fsPromises = require('fs').promises;
const path = require('path');

const handleLogout = async (req, res) => {
  // Needs to be done on FRONTEND On client, also delete the accessToken, needs to be done in the memory of the client application.



  const cookies = req.cookies;
  // Below is checking if a cookie contains JWT property
  if(!cookies?.jwt) return res.sendStatus(204); // No content
  
  const refreshToken = cookies.jwt;

  // Is refreshToken in db?


  const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken);
  if(!foundUser) {
    res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', source:true});
    return res.sendStatus(204); // No content
  }
  
  // Delete refreshToken in db 
  const otherUsers = usersDB.users.filter(person => person.refreshToken !== foundUser.refreshToken);
  const currentUser = {...foundUser,refreshToken: ''};
  usersDB.setUsers([...otherUsers,currentUser]);
  await fsPromises.writeFile(
    path.join(__dirname, '..', 'model', 'users.json'),
    JSON.stringify(usersDB.users)
  );
  res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', source:true}); // secure: true - only serves on https to place in Production Code
  res.sendStatus(204);
}
 

module.exports = { handleLogout};