require("dotenv").config();
const mongooes = require("mongoose");
mongooes.connect('mongodb://127.0.0.1:27017/restful-api');

const express = require("express");
const app = express();



const port = process.env.SERVER_PORT || 5000;

const userRoute = require('./routes/userRoute');

app.use('/api', userRoute);




app.listen(port, () =>{
    console.log(`server Listen on port no. ${port}`)
});
