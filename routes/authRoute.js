const express = require("express");
const router = express();

router.use(express.json());



const userController = require('../controllers/userController');

router.get('/', userController.mailVerification);


module.exports = router;