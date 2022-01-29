const express = require('express');
const mong = require('mongoose');
const bcrypt = require('bcrypt');
const regi = express.Router();
const regimodel = require('./registerschem')// register schema 
const dot =require('dotenv').config();

regi.post('/register',(req,res)=>{
    console.log(req.body) // removable
    const sr  = parseInt(process.env.SALT_ROUNDS)
    bcrypt.hash(req.body.password,sr,(err,hash)=>{ // .env the salt rounds

        if (err){
            console.log('bcrypt hash error')
            res.status(500).send({ 
                error:{
                    type:500,
                    message:'Internal server error'  // res.error.message
                }
            })
        }else{

            var regifill = new regimodel({
                firstname:req.body.fnm,
                surname:req.body.surn,
                email:req.body.email,
                username:req.body.usrnm,
                password:hash, // hashed password 
                phonenumber:req.body.pnum
            });

            regifill.save((err)=>{
                if (err){
                    console.log("theres a error in the process of saving a register")
                    console.log(err)
                    res.status(500).send({
                        success:false,
                        msg:'There was a problem creating your account, please try again later.'
                    })

                }else{
                    res.status(200).send({
                        success:true,
                        msg:'Account has been created successfully.'
                    });

                }
            });

        }
  
    })

})

//check for taken username 
regi.post('/takencredentials' , (req,res)=>{
    console.log('attempt to post at /takencred')
    console.log(req.body)

    if (req.body.username){
        regimodel.exists({username:req.body.username},(err,data)=>{
            if (err){console.log(err);console.log('an error has occurred tying to find if a username exists')}
            if (data===true){
                console.log('username match')
                res.status(200).send({
                    taken:true,
                    works:'yah'
                })
            }else if (data===false){
                res.send({
                    taken:false,
                    works:'yah'
                })
            }else{
                res.status(404).send()
            }
        })
    }else if (req.body.email){
        regimodel.exists({email:req.body.email},(err,data)=>{
            if (err){console.log(err)}
            if (data===true){ // if there is a match 
                console.log('datamatch')
                res.status(200).send({
                    taken:true,
                    works:'yah'

                })
            }else if (data===false){
                res.status(200).send({ // if there isnt a match
                    taken:false,
                    works:'yah'
                })
            }
        })

    }else{
        res.status(500)
    }

    
   
});


module.exports = regi