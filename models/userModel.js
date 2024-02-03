const mongooes = require("mongoose");

const userSchema = mongooes.Schema({
   
     name:{
        type:String,
        require:true
     },
     email:{
        type:String,
        require:true
     },
     mobile:{
        type:String,
        require:true
     },
     password:{
        type:String,
        require:true
     },
     is_verifide:{
        type:Number,
        default:0 // 1 verifide
     }

})


module.exports = mongooes.model("user", userSchema);