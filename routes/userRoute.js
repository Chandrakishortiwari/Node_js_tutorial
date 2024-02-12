const express = require("express");
const router = express();

router.use(express.json());

const path = require("path");
const multer = require("multer");


const storage = multer.diskStorage({
    destination: function(req, file, cb){
       
        if(file.mimetype === 'image/jpeg'  || file.mimetype === 'image/png'){
            cb(null, path.join(__dirname, '../public/images'));
        }

        cb(null, path.join(__dirname, '../public/images'));
    },
    filename: function(req, file, cb){
        const name = Date.now()+'-'+file.originalname;
        cb(null, name);
    }
});
   
const fileFilter =(req, file, cb) => {
    if(file.mimetype === 'image/jpeg'  || file.mimetype === 'image/png'){
       cb(null, true);
   }
   else{
    cb(null, false);
   }

}

const upload = multer({
    storage:storage,
    fileFilter:fileFilter
});

const userController = require('../controllers/userController');

const { registerValidatior, sendMailVerificationValidator, passwordResetValidator, loginValidator } =  require("../helpers/validation");

  const auth = require("../middleware/auth");

router.post('/register', upload.single('image'), registerValidatior, userController.userRegister);

router.post('/send-mail-verification', sendMailVerificationValidator, userController.sendMailVerification);

//router.post('/forgot-password', passwordResetValidator, userController.forgotPassword)

router.post('/forgot-password', passwordResetValidator, userController.forgotPassword);

router.post('/login', loginValidator, userController.loginUser);

// authentication routers
   
router.get('/profile', auth ,userController.userProfile);
   



module.exports = router;