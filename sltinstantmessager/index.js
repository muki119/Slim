//main manager 
const express = require('express')
const app = express()
var cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');
const mong = require('mongoose');//database connection (use environments)
const registerops = require('./regiops/register.js');//register middleware 
const loginops = require('./loginops/login.js');//login middleware 
const messops = require('./message_handle/messproc.js') // message handling middleware
const dot =require('dotenv').config();
const { Schema } = mong;

app.use(cookieParser())
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));
//starts server---
app.listen(25565,()=>{console.log('listening on 25565')})
//----
//----- login --------

app.get('/',(req,res,next)=>{
    res.send('mad')
})

app.use(registerops);//calls register middleware 
app.use(loginops);
app.use(messops);


//------------------------
//connects to database 
var url = process.env.DATABASE_CONURL
const usrdb = mong.connect("mongodb+srv://muki11:kimera11@cluster0.tew2a.mongodb.net/cluster0?retryWrites=true&w=majority",{useNewUrlParser: true,useUnifiedTopology: true,useCreateIndex:true},(err)=>{
    if (err){
        console.log('maindb connection error')
        console.log(err)
    }else{
      console.log('Successfull main db connection')  
    }
})

//schema to send to 

module.exports = usrdb;
module.exports = app;
