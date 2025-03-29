const express = require('express');
const regi = express.Router();
const Usermodel = require('../userschema/userschema')// register schema 
require('dotenv').config();


regi.get("/misc/getsimilar",(req,res)=>{ // this function finds the 
    var userstring = req.query.q
    Usermodel.find({username:{$regex: userstring, $options: 'i'}},"firstname username",{limit:5},(error,data)=>{ // find all usernames that are similar to the 
        if (!error){
            //console.log(data)
            res.send(data)  
        }else if (error){
            console.log (error)
        }
        
    })
})

regi.delete("/misc/removecookie",(req,res)=>{ // route for deleteing the cookie (authentication token )
    res.clearCookie("SID",{sameSite:process.env.SAMESITE}).send() // deletes the cookie
})
module.exports = regi