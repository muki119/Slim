const express = require('express');
const Messagerouter = express.Router();
const ccvmodel = require('./mess_schema')// schema to create new conversation
const regimodel = require('../regiops/registerschem')// register schema 
const userauth = require("./userauth.js")
const { Server } = require("socket.io"); // server
const { instrument } = require("@socket.io/admin-ui");
const RateLimit = require('express-rate-limit');
require("dotenv").config()
const io = new Server(8210 || 4080,{
    cors:{
        origin: [process.env.CORS_ORIGIN,"https://admin.socket.io"]
    },
    transports:["websocket","polling"]
})
instrument(io, {
    auth: false,
    namespaceName:"/"
});

io.on("connection", (socket) => {
    console.log(socket.id)

    socket.on('join_rooms',(rooms)=>{ // function for joining rooms(rooms should be an array of roooms of the user (rooms should be chat_id ))
        console.log(rooms)// testing
        socket.join(rooms)
    })

    socket.on('send_message',(room,message,callback)=>{ // room should be chat_id
        console.log(room,message)
        // update database find by chat id 
        ccvmodel.findOneAndUpdate({chat_id:room},{$push:{messages:message},$currentDate:{last_messaged:true}},(err)=>{ // adds message to database 
            if (err){
                console.log(err)
                callback({
                    sent:false
                })
            }else if (!err){
                console.log('success')
                socket.to(room).emit('incomming_message', room,message)//message should be {sender,message,timesent}
                callback({
                    sent:true
                });
        
            }
        })

    })

    socket.on("disconnect", (reason) => {
        console.log(reason)
    });
});

Messagerouter.post('/api/m/createconversation',userauth,(req,res)=>{ // creating a new conversation 
    var conv = new ccvmodel({
        users_involved:req.body.users_involved
    })
    conv.save((err)=>{
        if (err){res.send({success:false});console.log(err)}else{ 
            //console.log(conv)// sends back success and the chat that was created 
            var userwhocreatedchat = req.body.username
            var userstosendto = req.body.users_involved.filter(user=> user !== userwhocreatedchat)   
            io.to(userstosendto).emit("new_chat",conv) // send to everyone a newchat has been created 
            res.send({success:true,chat:conv})
        }
    })
    //make and join room - socket.io 
})


var getmsglimiter = RateLimit({
  windowMs: 5*60*1000, // 5 minutes
  max: 35
});

Messagerouter.post('/api/m/getmsgs',[getmsglimiter, userauth],(req,res)=>{
    var userToBeFound = req.body.username // user to be found (userToBeFound)
    regimodel.exists({username:userToBeFound},(error,out)=>{  /// checks if user exists 
        if (!error && out === true ){
            console.log(`${userToBeFound} exists`)
            ccvmodel.find({users_involved:{"$in":[userToBeFound]}},"users_involved date_created last_messaged messages chat_id ",{projection:{_id:0}}).sort({'last_messaged':-1}).exec((err,data)=>{ // finds user 
                if (err){ // if an error occured send a message that an error has occured 
                    res.send({error:'A error has occured'})
                    console.log(err)
                }else if (!err){ //otherwise send the data 
                    //console.log(data)
                    res.send(data)
                }
            })
        }else if (!error && out === false ){
            console.log(`${userToBeFound} dosent exist`)
            res.send("User not Found !")
        }else if (error){
            console.log("error in attempt to find is a user exists ")
            res.send("Error!")
        }   
    })
    
})


module.exports = Messagerouter





