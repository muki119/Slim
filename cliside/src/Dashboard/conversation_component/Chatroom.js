
import React, { createContext,useContext, useEffect, useState ,useReducer} from 'react';
import {
    Redirect
} from "react-router-dom";
//import UdContext from '../usercontext/usercontext';
import Messagecontext from '../messagecontext';
import Axios from 'axios'
import '../dashboard.css';
import './chatroom.css'
//import '.../general_css/gcss.css';
import { io } from "socket.io-client" ; 
import _ from 'lodash';
import ScrollableFeed from 'react-scrollable-feed'
import TextareaAutosize from 'react-textarea-autosize';


function Chatroom(){
    const {chats,setchats,currentchatid,socket,setsocket,forceUpdate} = useContext(Messagecontext) //chats are all the available chats from the users account -setchats is for updating when a message comes in or when you send a message - cchat_id to find the chat the user selected - socket are for realtime connection    
    const [message,setmessage]=useState('')
    const dashdata = JSON.parse(localStorage.getItem('UD'))
    

    function sendmsg(){
        if (message.length > 0 || message.trim().length !== 0){
            try {
                const messageobj = { // message object to be sent 
                    sender :dashdata.user.username,
                    message:message,
                    timesent:new Date(Date.now()).toISOString() // gets the time the message was sent 
                }
                socket.emit('send_message',currentchatid,messageobj) // change to get username
                const indx = chats.data.findIndex((e)=>{return e.chat_id == currentchatid}) 
                const cht = chats
                cht.data[indx].messages.push(messageobj)
                cht.data[indx].last_messaged = new Date(Date.now()).toISOString()
                //console.log(cht.data[indx].last_messaged )
                setmessage('')
                forceUpdate()
            } catch (error) {
                console.log('error in attempt to send ')
            }
            
            
        }
        //send message socket.emit('send_message',currentchatid,{message:message})
        //add message to chats state
        //clear input setmessage()
        //if error show it 
    }

    useEffect(()=>{ // incoming message handling 
        if (socket!== null ){
            socket.on('incomming_message',(room,incmessage)=>{ // handling a incoming message 
                try {
                    //console.log(`incoming message from room ${room}:${JSON.stringify(incmessage)}`)
                    const indx = chats.data.findIndex((e)=>{return e.chat_id == room}) 
                    const cht = chats
                    cht.data[indx].messages.push(incmessage) // adds message to array to be displayed 
                    cht.data[indx].last_messaged = new Date(Date.now()).toISOString()
                    //setchats(chats=>[...chats.data[indx].messages,incmessage])
                    //onsole.log(chats.data)
                    //console.log(indx)
                    forceUpdate() // forces update so its displayed 
                    //chats.data[indx].messages.push(incmessage) // adds message to username array that will be displayed 
                    //change time of last messaged 
                } catch (error) {
                    console.log('error recieving message')
                }
                
            })

            return ()=>{ // cleanup function so there arent multiple listeners 
                socket.off()
            }
        }
        
    },[socket,chats])

    if (chats.data != [] && socket!== null ){ // if the user has available chats 

        const p = chats.data.findIndex((e)=>{return e.chat_id == currentchatid}) // finds
        const currentchat = chats.data[p] // change the contents using setchats

        if (currentchat != undefined){
            const currentcmsgs = currentchat.messages // current chat messages 
            const mappedmsgs = currentcmsgs.map((e,index,arr)=>{
                var prevarr = arr[index-1]
                var nextarr = arr[index+1]
                if (e.sender !== dashdata.user.username){ // if the sender 
                    if (index>0 && index!==(arr.length-1)){
                        if (e.sender === nextarr.sender && e.sender !== prevarr.sender){ /// if its the top of the sandwhich
                            return <span class = 'incoming_message_container' key={index}><span class = 'incoming_message_top' key={index} >{e.message}</span></span>
                        }else if (e.sender === nextarr.sender && e.sender === prevarr.sender){ // if middle of sandwhich 
                            return <span class = 'incoming_message_sandwich_container' key={index}><span class = 'incoming_message_middle' key={index} >{e.message}</span></span>
                        }else if (e.sender !== nextarr.sender && e.sender === prevarr.sender){ // if bottom of sandwhich 
                            return <span class = 'incoming_message_sandwich_container' key={index}><span class = 'incoming_message_bottom' key={index} >{e.message}</span><span class ='sentby'>{e.sender}</span></span> 
                        }else{
                            return <span class = 'incoming_message_container' key={index}><span class = 'incoming_message' key={index} >{e.message}</span><span class ='sentby'>{e.sender}</span></span> 
                        }
                    }else{
                        return <span class = 'incoming_message_container' key={index}><span class = 'incoming_message' key={index} >{e.message}</span><span class ='sentby'>{e.sender}</span></span> 
                    }  
                }else if (e.sender === dashdata.user.username){
                    return <span class = 'users_message_container' key={index} ><span class = 'users_message'>{e.message}</span></span>
                }
            })

            const mappedresp =  [currentchat.users_involved.slice(0,currentchat.users_involved.indexOf(dashdata.user.username)).toString(),currentchat.users_involved.slice(currentchat.users_involved.indexOf(dashdata.user.username)+1).toString()]
            return (
                <div class = 'chatroom_container'>
                    <div class = 'Recipients'>{mappedresp}</div>
                    <div class ='message_section '>
                        <ScrollableFeed >
                            {mappedmsgs}
                        </ScrollableFeed>
                    </div>
                    <div class = 'message_input_box' >
                        <TextareaAutosize id = 'test' value={message} placeholder='Type something here :)' onChange={(e)=>{setmessage(e.target.value)}} minRows={2}style={{fontsize:'2rem'}}></TextareaAutosize>
                        
                        <button id='sendbtn'onClick={sendmsg}>Send</button>
                    </div>
                    
             
                </div>
            )

        }else{
            return(<h1>No Chat selected</h1>)
        }
    }else{
        return(
            <h1>No Available conversations</h1>
        )
    }
}

export default Chatroom