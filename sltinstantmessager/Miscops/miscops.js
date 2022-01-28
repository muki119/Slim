const express = require('express');
const mong = require('mongoose');
const bcrypt = require('bcrypt');
const regi = express.Router();
const regimodel = require('../regiops/registerschem')// register schema 
const dot =require('dotenv').config();


regi.post("/api/misc/getsimilar",(req,res)=>{ // this function finds the 
    console.log(req.body.username)
    regimodel.find({username:{$regex: req.body.username, $options: 'i'}},"firstname username",{limit:5},(error,data)=>{
        if (!error){
            console.log(data)
          res.send(data)  
        }else if (error){
            console.log ("a error has arisent in the get similar route ")
        }
        
    })
})

module.exports = regi