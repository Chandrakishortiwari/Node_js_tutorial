const jwt = require("jsonwebtoken");

const config = process.env;

 const verifyToken = async(req, res, next) =>{

   const token = req.body.token || req.query.token || req.headers["authorization"];
  
   if(!token){
     return res.status(403).json({
        success: false,
        msg: 'A token is require for authentication'
     });
   }

   try{

      const bearer = token.split(' ');
      const bearerToken = bearer[1];

      const decodedData = jwt.verify(bearerToken, config.ACCESS_TOKEN_SCRET);
        req.User = decodedData;
   }
   catch(error){
    return res.status(401).json({
        success: false,
        msg: 'Invalid token'
     });
   }

   return next();

 };



 module.exports = verifyToken;