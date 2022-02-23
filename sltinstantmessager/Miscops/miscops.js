const express = require('express');
const regi = express.Router();
const regimodel = require('../regiops/registerschem')// register schema 
require('dotenv').config();


regi.post("/api/misc/getsimilar",(req,res)=>{ // this function finds the 
    //console.log(req.body.username)
    regimodel.find({username:{$regex: req.body.username, $options: 'i'}},"firstname username",{limit:5},(error,data)=>{
        if (!error){
            //console.log(data)
            res.send(data)  
        }else if (error){
            console.log ("a error has arisent in the get-similar route ")
        }
        
    })
})

regi.delete("/api/misc/removecookie",(req,res)=>{
    res.clearCookie("SID").send()
})
module.exports = regi