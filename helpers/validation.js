const { check } = require("express-validator");


  exports.registerValidatior = [
     check('name', 'Name is require').not().isEmpty(),
     check('email', 'write a correct email').normalizeEmail({gmail_remove_dots:true}),
     check('mobile', 'mobile no compusari 10 digit').isLength({
        min:10,
        max:10
     }),
     check('password', 'passwod most be 8 digit').isLength({
        min:6
     }),

     check('image' ).custom( (value, {req}) =>{
      if(req.file.mimetype === 'image/jpeg' || req.file.mimetype === 'image/png'){
         return true;
      }else{
         return false; 
      }
     } ).withMessage("please upload an image jpge or png")
];


 exports.sendMailVerificationValidator = [
   check('email', 'write a correct email').isEmail().normalizeEmail({gmail_remove_dots:true})
];


exports.passwordResetValidator = [
   check('email', 'write a correct email').isEmail().normalizeEmail({gmail_remove_dots:true})
]


 exports.loginValidator =[
   check('email', 'write a correct email').isEmail().normalizeEmail({gmail_remove_dots:true}),
   check('password', 'password is require').not().isEmpty()
 ];