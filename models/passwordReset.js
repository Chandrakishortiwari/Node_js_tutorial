const mongooes = require("mongoose");

const passwordResetSchema = mongooes.Schema({
   
     user_id:{
        type:String,
        require:true,
        ref: 'user'
     },
     token:{
        type:String,
        require:true
     }

})


module.exports = mongooes.model("PasswordReset", passwordResetSchema);