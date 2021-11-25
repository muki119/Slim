const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const messdb = require('./mess_db') // message database connection 
const ccvmodel = require('./mess_schema')// schema to create new conversation
const { Server } = require("socket.io"); // server

const io = new Server(8210,{
    cors:{
        origin: ["http://localhost:8080"]
    }
})

io.on("connection", (socket) => {
    console.log(socket.id)

    socket.on('join_rooms',(rooms,message)=>{ // function for joining rooms(rooms should be an array of roooms of the user (rooms should be chat_id ))
        console.log(rooms)// testing
        socket.join(rooms)
        //console.log(message)
    })
    socket.on('send_message',(room,message)=>{ // room should be chat_id
        
        // update database find by chat id 
        ccvmodel.findOneAndUpdate({chat_id:room},{$push:{message}},(err)=>{
            if (err){
                console.log(err)
            }else if (!err){
                socket.to(room).broadcast.emit('incomming_message',message)//message should be {sender,message,timesent}
            }
        })

    })
    socket.on("disconnect", (reason) => {
        //console.log(reason)
    });
});

router.post('/api/m/crt_conv',(req,res)=>{ // creating a new conversation 
    //get usernames involved 
    var conv = new ccvmodel({
        users_involved:['@richpaul','@robpelinky','@stacko']
    })
    conv.save((err)=>{
        if (err){console.log(err)}else{
            console.log('works i guess')
            res.send('eh')
        }
        
    })
    //make and join room - socket.io 
})

router.post('/api/m/smsg',(req,res)=>{ // no need make a socket .io instance to handle the message sent thing 
    console.log(req.body)
    res.send('works - send msg ')
}) // send message - use socket


router.post('/api/m/getmsgs',(req,res)=>{
    var utbf = req.body.username // user to be found (utbf)
    ccvmodel.find({users_involved:{"$in":[utbf]}},"users_involved date_created last_messaged messages chat_id ",{projection:{_id:0}},(err,data)=>{ // finds user 
        if (err){ // if an error occured send a message that an error has occured 
            res.send({error:'A error has occured'})
            console.log(err)
        }else if (!err){ //otherwise send the data 
            console.log(data)
            res.send(data)
        }
    })
})
//----- Socket.io startup 


function emitrefresh(room){ // emmit refresh using socket or whatever
    
}

function authcheck(req,res,next){ // valid user authenticator // makes sure person asking for conversations is the real person 
}




// when creating a new conversation - use this schema 

module.exports = router





