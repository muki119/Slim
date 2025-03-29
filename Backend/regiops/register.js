const express = require('express');
const bcrypt = require('bcrypt');
const registerRoutes = express.Router();
const Usermodel = require('../userschema/userschema')// register schema 
require('dotenv').config();
var RateLimit = require('express-rate-limit');
var registerlimiter = RateLimit({
  windowMs: 10*60*1000, // 10 minutes
  max: 40
});

registerRoutes.post('/register',registerlimiter,(req,res)=>{
    //console.log(req.body) // removable
    const sr  = parseInt(process.env.SALT_ROUNDS)
    bcrypt.hash(req.body.password,sr,(err,hashedPassword)=>{ // .env the salt rounds -- hashes the password and returns the hashed password

        if (err){ // if there is an error when hashing the password 
            console.log('bcrypt hash error')
            res.status(500).send({  // tell client that there was a error on the server.
                error:{
                    type:500,
                    message:'Internal server error'  // res.error.message
                }
            })
        }else{

            var regifill = new Usermodel({ //created a model for the userdata before being d=save to the database 
                firstname:req.body.fnm,
                surname:req.body.surn,
                email:req.body.email,
                username:req.body.usrnm,
                password:hashedPassword, // hashed password 
                phonenumber:req.body.pnum
            });

            regifill.save((err)=>{ // attempts to save from the database.
                if (err){ // if there is an error saving ti the database 
                    console.log(err)
                    res.status(500).send({
                        success:false,
                        msg:'There was a problem creating your account, please try again later.'
                    })

                }else{ // on successfull creation 
                    res.status(201).send({ // send response back to client that the account has been successfully created 
                        success:true,
                        msg:'Account has been created successfully.'
                    });

                }
            });

        }
  
    })

})

//check for taken username 
var takencredlimiter = RateLimit({
    windowMs: 5*60*1000, // 1 minute
    max: 50
  });
registerRoutes.post('/takencredentials' ,takencredlimiter, (req,res)=>{


    if (req.body.username){ // if they are trying to find a taken username. 
        Usermodel.exists({username:req.body.username},(err,data)=>{ // check if username exists 
            if (err){console.log(err);console.log('An error has occurred tying to find if a username exists')} // if error ,respond back to client that ther was an error 
            if (data===true){ // if username exists 
                res.status(200).send({ // respond to client that username has been taken 
                    taken:true,
                })
            }else if (data===false){ //if it hasnt been taken 
                res.send({ // respond to client that it has not been taken 
                    taken:false,    
                })
            }
        })
    }else if (req.body.email){// if trying to find a taken email 
        Usermodel.exists({email:req.body.email},(err,data)=>{
            if (err){console.log(err)}
            if (data===true){
                res.status(200).send({
                    taken:true,
                })
            }else if (data===false){
                res.status(200).send({ 
                    taken:false,
                })
            }
        })

    }else{
        res.status(500)
    }

    
   
});


module.exports = registerRoutes