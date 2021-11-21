const User = require('../model/User');
const bcrypt = require('bcrypt');

// file system
// const fsPromises = require('fs').promises;
// Used to write to file path
// const path = require('path');


const handleNewUser = async (req, res) => {
  const { user,pwd} = req.body;
  if(!user || !pwd) return res.status(400).json({'message': 'Username and password are required.'});
  // check for duplicate usersname in the db
  // .exec(); not needed in all moongose method, findOne() does bc of callback
  const duplicate = await User.findOne({username: user}).exec();
  if(duplicate) return res.sendStatus(409); // conflict
  try {
     // encrypt the password
    const hashedPwd = await bcrypt.hash(pwd, 10);
    // create and store the new user
    const result = await User.create({
      "username": user, 
      "password": hashedPwd
    });

    
    console.log(result);
    
    res.status(201).json({'success': `New user ${user} created!`})
  } catch (err){
    res.status(500).json({'message' : err.message});
  }
}

module.exports = { handleNewUser};