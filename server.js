require("dotenv").config();
const mongooes = require("mongoose");
mongooes.connect('mongodb://127.0.0.1:27017/restful-api');

const express = require("express");
const app = express();


app.set('view engine', 'ejs');
app.set('views', './views');


const port = process.env.SERVER_PORT || 3000;

const userRoute = require('./routes/userRoute');

app.use('/api', userRoute);

const authRoute = require('./routes/authRoute');

app.use('/', authRoute);



app.listen(port, () =>{
    console.log(`server Listen on port no. ${port}`)
});
