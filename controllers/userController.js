const user = require('../models/userModel'); // Change 'user' to 'userModel'
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const mailer = require("../helpers/mailer");
const randomstring = require("randomstring");
const PasswordReset = require("../models/passwordReset");
//const passwordReset = require('../models/passwordReset');
 const jwt = require("jsonwebtoken");

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
      const msg = '<p>hii '+ userData.name+', please click <a href="http://127.0.0.1:3000/reset-the-password?token='+randomString+'"> here </a> to reset your password  </p>';
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

 const resetPassword = async(req, res) =>{

   try{
    
      if(req.query.token == undefined){
        console.log(req.query.token);
        return res.render('404');
      }

    const resetData = await PasswordReset.findOne({ token: req.query.token });
    
    if(!resetData){
      return res.render('not-matched-token');
    }
 
    return res.render('reset-password', { resetData });

   }

   catch(error){
     return res.render('404');
   }

 }
 
 const updatePassword = async(req, res) =>{

   try{
    
      const { user_id, password, c_password } = req.body;

       

      const resetData = await PasswordReset.findOne({ user_id });

      if(password != c_password){

        return res.render('reset-password', { resetData, error:'confirm Password not matching!' });

      }

    const hashedPassword = await bcrypt.hash(c_password, 10);

     await user.findByIdAndUpdate({ _id: user_id },{
      $set:{
        password: hashedPassword
      }
    });

    PasswordReset.deleteOne({ user_id });

    return res.redirect('/reset-sucess');

   }
   catch(error){
    return res.render('404');
  }
   
 }

 const resetSucess = async(req, res) =>{

    try{
        return res.render('reset-sucess')
    }
    catch(error){
    return res.render('404');
  }

 }

 const generateAccessToken = async (User) =>{
   const token =  jwt.sign(User, process.env.ACCESS_TOKEN_SCRET,{ expiresIn:"2h" });
   return token;
 }


 const loginUser = async(req, res)=>{
   
  try{
    
   const errors = validationResult(req);

   if(!errors.isEmpty()){
  
     return res.status(400).json({
      success:false,
      msg:'Errors',
      errors: errors.array()
     });
   }

    const { email,  password } = req.body;

    const userData = await user.findOne({ email });

    if(!userData){
      return res.status(401).json({
        success: false,
        msg: "Email and password is Incorrect! "
      });
    }

   const passwordMatch = await bcrypt.compare(password, userData.password);

     if(!passwordMatch){
      return res.status(401).json({
        success: false,
        msg: "Email and password kis pIncorrect! "
      });
     }

     if(userData.is_verifide == 0){
      return res.status(401).json({
        success: false,
        msg: "Not Verifyed Accound"
      });
     }

   const accessToken = await generateAccessToken({ User:userData });


   return res.status(200).json({
    success: true,
    msg: "Not Verifyed Accound",
    User: userData,
    accessToken: accessToken,
   tokenType: 'Bearer'
  });
 }



  
  catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message
    });
   }
};



const userProfile = async(req, res) =>{
   
   try{

    const userData =  req.User.User

     return res.status(200).json({
      success: true,
      msg: 'User Profile Data',
      data: userData 
     })


   }
   catch (error) {
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
  forgotPassword,
  resetPassword,
  updatePassword,
  resetSucess,
  loginUser,
  userProfile
  

};
