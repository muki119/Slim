//main manager 
const express = require('express')
const app = express()
var cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');
const mong = require('mongoose');//database connection (use environments)
const registerops = require('./regiops/register.js');//register middleware 
const loginops = require('./loginops/login.js');//login middleware 
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


//------------------------
//connects to database 
var url = process.env.DATABASE_CONURL
mong.connect(url,{useNewUrlParser: true,useUnifiedTopology: true} )

//schema to send to 

module.exports = app;