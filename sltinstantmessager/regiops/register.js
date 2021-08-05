const express = require('express');
const mong = require('mongoose');
const bcrypt = require('bcrypt');
const regi = express.Router();
const regimodel = require('./registerschem')// register schema 
const dot =require('dotenv').config();

regi.post('/register',(req,res)=>{
    console.log(req.body)
    const sr  = process.env.SALT_ROUNDS
    bcrypt.hash(req.body.password,10,(err,hash)=>{ // .env the salt rounds

        console.log(hash)

        var regifill = new regimodel({
            firstname:req.body.fnm,
            surname:req.body.surn,
            email:req.body.email,
            username:req.body.usrnm,
            password:hash, // hased password 
        });

        regifill.save((err)=>{
            if (err){console.log("theres a error in the process of saving a register")}
        });
        res.send(regifill);
    })

})


//check for taken username 



module.exports=regi
