const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { connect, route } = require('../regiops/register');
const mes_schema = require('./mes_schema')// register schema 
const dot =require('dotenv').config();
const { Schema } = mongoose
//connect to messages database 


const dburl = process.env.MESSDATABASE_CONURL 
const mesdb = mongoose.createConnection("mongodb+srv://muki11:kimera11@cluster0.tew2a.mongodb.net/mess_db?retryWrites=true&w=majority",{useNewUrlParser: true,useUnifiedTopology: true,useCreateIndex:true},(err)=>{ // makes new connection to databse so no errors
    if (err){
        console.log('messagedb connection error')
        console.log(err)
    }else{
        console.log('Successfull connecttion to message db')
        
    }
    
})

router.post('/api/m/crt_conv',(req,res)=>{ // creating a new conversation 
    //get usernames involved 
    //make and join room - socket.io 
})

router.post('/api/m/smsg',(req,res)=>{
    console.log(req.body)
    res.send('works - send msg ')
}) // send message - use socket

function emitrefresh(room){ // emmit refresh using socket or whatever

}


// when creating a new conversation - use this schema 
const newconv = Schema({
    usrsinv:{
        type:Array,
        required:true,
    },
    date_created:{
        type:Date,
        default:Date.now()
    },
    lastmessaged:{
        type:Date,
        default:Date.now()
    },
    messages:{
        type:Array,
        default:null, // initial one should be 
    }
});

const ncmodel  = mesdb.model('mess_col',newconv)

module.exports = router

