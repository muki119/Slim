const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const messdb = require('./mess_db') // message database connection 
const ccvmodel = require('./mess_schema')// schema to create new conversation


router.post('/api/m/crt_conv',(req,res)=>{ // creating a new conversation 
    //get usernames involved 
    var conv = new ccvmodel({
        users_involved:['@robpelinky','@richpaul']
    })
    conv.save((err)=>{
        if (err){console.log(err)}
        console.log('works i guess')
        res.send('eh')
    })
    //make and join room - socket.io 
})

router.post('/api/m/smsg',(req,res)=>{
    console.log(req.body)
    res.send('works - send msg ')
}) // send message - use socket

function emitrefresh(room){ // emmit refresh using socket or whatever
    
}





// when creating a new conversation - use this schema 

module.exports = router





