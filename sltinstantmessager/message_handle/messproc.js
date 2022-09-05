const express = require('express');
const Messagerouter = express.Router();
const ccvmodel = require('./mess_schema')// schema to create new conversation
const Usermodel = require('../userschema/userschema')// register schema 
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
    //console.log(socket.id)

    socket.on('join_rooms',(rooms)=>{ // function for joining rooms(rooms should be an array of roooms of the user (rooms should be chat_id ))
        try{
            socket.join(rooms)
            // callback saying successfull join
        }catch(err){
            //send back error when joining room 
        }
        
    })

    socket.on('sendMessage',(room,message,callback)=>{ // room should be chat_id
        // update database find by chat id 
        ccvmodel.findOneAndUpdate({chat_id:room},{$push:{messages:message},$currentDate:{last_messaged:true}},(err)=>{ // adds message to database 
            if (err){
                console.log(err)
                callback({
                    sent:false,
                    reason:"The server Was unable to send the message",
                    error_code:500
                })
            }else if (!err){
                socket.to(room).emit('incomming_message', room,message)//message should be {sender,message,timesent}
                callback({
                    sent:true
                });
        
            }
        })

    })

});

Messagerouter.post('/createconversation',userauth,(req,res)=>{ // creating a new conversation 
    var conv = new ccvmodel({
        chat_name:req.body.chatName,
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
  max: 25
});

Messagerouter.post('/getmsgs',[getmsglimiter, userauth],(req,res)=>{
    var userToBeFound = req.body.username // user to be found (userToBeFound)
    Usermodel.exists({username:userToBeFound},(error,out)=>{  /// checks if user exists 
        if (!error && out === true ){
            //console.log(`${userToBeFound} exists`)
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
Messagerouter.post('/leave-conversation',userauth,(req,res)=>{
    const username = req.body.username
    const chatId = req.body.chatId
    const findObj = {"$and":[
        {chat_id:chatId}, // finds chat 
        {users_involved:{"$in":username}} //sees if youre in the chat
        ]
    }
    const updateObj={"$pull":{users_involved:username}}

    ccvmodel.findOneAndUpdate(findObj,updateObj,(err,data)=>{
        if(!err){
            res.send(data)
        }else if (err){
            res.send(err)
        }
    })
    //chat id 
    // if theyre in the chat 
    //if so remove them in the array 
    //send success callback
})

Messagerouter.post('/addtoconversation',userauth,async (req,res)=>{
    const username = req.body.username
    const userToAdd = req.body.userToAdd
    const chatId = req.body.chatId
    const findObj = {"$and":[
        {chat_id:chatId}, // finds chat 
        {users_involved:{"$nin":userToAdd}},
        {users_involved:{"$in":username}}  // checks if the user adding the person is in that chat and the person to be added is not 
        ]
    }
    const updateObj={"$push":{users_involved:userToAdd}}
    const notTheSame = username !== userToAdd
    if (notTheSame){
        try{
            ccvmodel.findOneAndUpdate(findObj,updateObj,(err,data)=>{
                if (!err){
                    if (!data){
                        res.send({
                            success:false,
                            errorCode:426,
                            message:"This chat may not exist ,The user is not in the conversation or the person that is being added is already in the conversation "
                        })
                    }else{
                        res.send({
                            success:true
                        })
                    }
                }else{
                    res.status(500).send("Server-Side Error please try again later")
                }
                
            })
            
        }catch(err){
            res.status(500).send("Server-Side Error please try again later") //testing 
        }
        
    }else{
        try {
            res.send("same")
        } catch (error) {
            console.log("same")
        }
    }
    
    //check if theyre in the chat
    //add person to the chat.
    //send success
    
})


module.exports = Messagerouter





