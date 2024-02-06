const user = require('../models/userModel'); // Change 'user' to 'userModel'
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const mailer = require("../helpers/mailer");
const randomstring = require("randomstring");
const PasswordReset = require("../models/passwordReset");

const userRegister = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
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
      password: hashedPassword, // Use the hashed password
      image: 'images' + req.file.filename
    });

    const userData = await newUser.save();

    const msg = '<p> hii '+name+', Please <a href="http://127.0.0.1:3000/mail-verification?id='+userData._id+'">>Verifi </a> your mail. </P>'; 
     
       mailer.sendMail(email, 'mail verification', msg);


    return res.status(200).json({
      success: true,
      msg: 'Registered successfully!',
      user: userData,
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: "Failed to register", // Corrected the typo here ('tao' to 'to')
    });
  }
}


const mailVerification = async (req, res) => {
  try {
    if (req.query.id == undefined) {
      return res.render('404');
    }
      
    const userData = await user.findOne({_id: req.query.id});

    if(userData){

      if(userData.is_verifide == 1){
        return res.render('mail-verification', {message:'mail is allready verifide'});

      }

      await user.findByIdAndUpdate({_id: req.query.id},{

        $set:{
          is_verifide:1

        }
      });

      return res.render('mail-verification', {message:'mail is verifide succecfully'});

    }else{
      return res.render('mail-verification', {message:'user data not found'})
    }
    
  } catch (error) {
    console.error(error.message);
    return res.render('404');
  }
};


const sendMailVerification = async(req, res) => {
   
  try{
     
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        msg: 'Errors',
        errors: errors.array()
      });
    }
     const { email } = req.body;


     const userData = await user.findOne({email});

     if(!userData){
      return res.status(400).json({
        success: false,
        msg: "Email is not exists"
      });
     }

     if(userData.is_verifide == 1){
      return res.status(400).json({
        success: false,
        msg: userData.email+"Email is all ready verifi"
      });
     }

     const msg = '<p> hii '+userData.name+', Please <a href="http://127.0.0.1:3000/mail-verification?id='+userData._id+'">>Verifi </a> your mail. </P>'; 
     
       mailer.sendMail(userData.email, 'mail verification', msg);


    return res.status(200).json({
      success: true,
      msg: 'Verification link send please chaek ',
      
    });

  }
  catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message
    });
  }
}


 const forgotPassword =async(req, res) =>{

    try{
       
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          msg: 'Errors',
          errors: errors.array()
        });
      }
       const { email } = req.body;
  
  
       const userData = await user.findOne({email});
  
       if(!userData){
        return res.status(400).json({
          success: false,
          msg: "Email is not exists"
        });
       }

      const randomString = randomstring.generate();
      const msg = '<p>hii '+ userData.name+', please click <a href="http://localhost:3000/reset-password?token='+randomString+'">heatre </a> to reset your password  </p>';
      await PasswordReset.deleteMany({user_id: userData._id});
      const passwordReset = new PasswordReset({
        user_id: userData._id,
        token:randomString
      });
      await passwordReset.save();

      mailer.sendMail(userData.email, 'Reset Password', msg);
      
      return res.status(201).json({
        success: true,
        msg: 'reset password Link send to your mail please check'
      });


}catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message
    });
  }

 }




module.exports = {
  userRegister,
  mailVerification,
  sendMailVerification,
  forgotPassword
};
