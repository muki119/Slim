const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const messdb = require('./mess_db') // message database connection 
const ccvmodel = require('./mess_schema')// schema to create new conversation
const regimodel = require('../regiops/registerschem')// register schema 
const jwt = require('jsonwebtoken');
const dot =require('dotenv').config();
const bcrypt = require('bcrypt');

function userauth (req,res,next){// this checks the jwt sent alongside to verify that what is sent is the user // this process should also be rate limited as the login one and register 
   
    if (!req.body.Uat){
        res.send("error")
    }else if (req.body.Uat){
        const uat = req.body.Uat
        const decrypted_jwt= jwt.verify(uat,process.env.JWTSK);
        if (decrypted_jwt.username === req.body.username){
            regimodel.findOne({username:decrypted_jwt.username},'password',(error,data)=>{ // data is the found user 
                //console.log(data)
                if (!error){
                    if (data == null) { // if theres no user matching the description then say that user cannot be found 
                        console.log('user is not found')
                        res.status(200).send({login_error:'Invalid jwt'});
                    }else{ //otherwise there is a matching user 
                        bcrypt.compare(decrypted_jwt.password,data.password,async (err, result) =>{
                            if (!err && result == true){  // if everything checks out
                                next()
                            }else if (!err && result == false){ // if the password in the jwt is incorrect to the user 
                                console.log("user not authentic")
                            }else if (err){ // if there is a error
                                res.status(500).send("error")
                            }
                        })  
                    } // comapares passwords 
                }else if (error){
                    console.log(error)
                }   
            })
        }else if (decrypted_jwt.username !== req.body.username){
            console.log("jwt isnt the same as username ?")
            res.status(200).send({login_error:'Invalid jwt'});
        }
        
    }
}



module.exports = userauth