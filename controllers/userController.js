const user = require('../models/userModel'); // Change 'user' to 'userModel'

const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

const userRegister = async (req, res) => {
  try {
      
   const errors = validationResult(req);

   if(!errors.isEmpty()){
    return res.status(400).json({
      success: false,
      msg: 'Errors',
      errors: errors.array()
    });
   }
      
    const { name, email, mobile, password } = req.body;

    const isExists = await user.findOne({ email }); // Change 'user' to 'userModel'

    if (isExists) {
      return res.status(400).json({
        success: false,
        msg: 'Email already exists',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Await for the hash function

    const newUser = new user({
      name,
      email,
      mobile,
      password: hashedPassword // Use the hashed password
     // image: 'images' + req.file.filename,
    });

    const userData = await newUser.save();

    return res.status(200).json({
      success: true,
      msg: 'Registered successfully!',
      user: userData,
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: "Failed to register",
    });
  }
}

module.exports = {
  userRegister
};
