const { check } = require("express-validator");


exports.registerValidatior = [
     check('name', 'Name is require').not().isEmpty(),
     check('email', 'write a correct email').normalizeEmail({gmail_remove_dots:true}),
     check('mobile', 'mobile no compusari 10 digit').isLength({
        min:10,
        max:10
     }),
     check('password', 'passwod most be 8 digit').not().isStrongPassword({
        minLength:6
     }),

   //   check('image' ).custom( (value, {req}) =>{
   //    if(req.File.mimetype === 'image/jpeg' || req.File.mimetype === 'image/png'){
   //       return true;
   //    }else{
   //       return false; 
   //    }
   //   } ).withMessage("please upload an image jpge or png")
]