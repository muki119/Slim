import React, {useEffect, useState} from 'react';
//import UdContext from '../usercontext/usercontext';
import '../dashboard.css';
import './chatroom.css'
import ScrollableFeed from 'react-scrollable-feed'
import TextareaAutosize from 'react-textarea-autosize';
import $ from "jquery";

function Chatroom({chats,setchats,currentchatid,socket,setsocket,forceUpdate}){ // this is wwhere the messages are displayed from 
//chats are all the available chats from the users account -setchats is for updating when a message comes in or when you send a message - cchat_id to find the chat the user selected - socket are for realtime connection    
    const [message,setmessage]=useState('')
    const dashdata = JSON.parse(localStorage.getItem('UD'))
    
    function sendmsg(){
        if (message.length > 0 || message.trim().length !== 0){
            try {
                const messageObject = { // message object to be sent 
                    sender :dashdata.user.username,
                    message:message,
                    timesent:new Date(Date.now()).toISOString() // gets the time the message was sent 
                }
                socket.emit('sendMessage',currentchatid,messageObject,(response)=>{
                    //console.log(response.sent)
                }) // change to get username
                const indx = chats.data.findIndex((e)=>{return e.chat_id === currentchatid}) // current chat index in array
                const cht = chats
                cht.data[indx].messages.push(messageObject)
                cht.data[indx].last_messaged = new Date(Date.now()).toISOString()
                //console.log(cht.data[indx].last_messaged )
                setmessage('')
                forceUpdate()
                $(".styles_scrollable-div__prSCv div ")[0].scrollIntoView({block:'end'});
                $("#text_area").focus();
            } catch (error) {
                //console.log('error in attempt to send ')
            }
        }
        //send message socket.emit('send_message',currentchatid,{message:message})
        //add message to chats state
        //clear input setmessage()
        //if error show it 
    }
    useEffect(()=>{ // incoming message handling 
        if (socket!== null ){
            socket.on('incomming_message',async(room,incmessage)=>{ // handling a incoming message 
                try {
                    //console.log(`incoming message from room ${room}:${JSON.stringify(incmessage)}`)
                    await addchat(incmessage,room)
                    forceUpdate() // forces update so its displayed 
                } catch (error) {
                    
                }
                
            })

            return ()=>{ // cleanup function so there arent multiple listeners 
                socket.off()
            }

            function addchat(incmessage,room){
                try {
                    const indx = chats.data.findIndex((e)=>{return e.chat_id === room}) 
                    const cht = chats
                    cht.data[indx].messages.push(incmessage) // adds message to array to be displayed 
                    cht.data[indx].last_messaged = new Date(Date.now()).toISOString() 
                } catch (error) {
                    return error
                }

            }
        }
        
    },[socket, chats, forceUpdate])

    if (chats.data.length !== 0 && socket!== null ){ // if the user has available chats 

        const p = chats.data.findIndex((e)=>{return e.chat_id === currentchatid}) // finds
        const currentchat = chats.data[p] // change the contents using setchats

        if (currentchat !== undefined){
            const mappedmsgs = mapAllMessages(currentchat.messages,dashdata)
            //const mappedresp =  [currentchat.users_involved.slice(0,currentchat.users_involved.indexOf(dashdata.user.username)).toString(),currentchat.users_involved.slice(currentchat.users_involved.indexOf(dashdata.user.username)+1).toString()] // recipients  
            return (
                <div className = 'chatroom_container'>
                    <div className ='message_section '>
                        <ScrollableFeed>
                            {mappedmsgs}
                        </ScrollableFeed>
                    </div>
                    <div className = 'message_input_box' >
                        <TextareaAutosize id = 'text_area' value={message} placeholder='Type something here :)' onChange={(e)=>{setmessage(e.target.value)}} minRows={2}style={{fontsize:'2rem'}}></TextareaAutosize>  
                        <button id='sendbtn'onClick={sendmsg}>Send</button>
                    </div>
                </div>
            )
        }else{
            return(null)
        }
    }else{
        return(
            <>
                <div className='noAvailableConversations'>
                    <h1>No available chats</h1>
                    <h2>Create a chat</h2>
                </div>
            </>
        )
    }
}

function mapAllMessages(currentcmsgs,dashdata){ // this function displays the messages
    return currentcmsgs.map((chatMessage,index,arr)=>{ // this maps the incoming messages and users messages
        var prevarr = arr[index-1]
        var nextarr = arr[index+1]
        if (chatMessage.sender !== dashdata.user.username){ // if the sender 
            if (index>0 && index!==(arr.length-1)){
                if (chatMessage.sender === nextarr.sender && chatMessage.sender !== prevarr.sender){ /// if its the top of the sandwhich
                    return <span className = 'incoming_message_container' key={index}><span className = 'incoming_message_top' key={index} >{chatMessage.message}</span></span>
                }else if (chatMessage.sender === nextarr.sender && chatMessage.sender === prevarr.sender){ // if middle of sandwhich 
                    return <span className = 'incoming_message_sandwich_container' key={index}><span className = 'incoming_message_middle' key={index} >{chatMessage.message}</span></span>
                }else if (chatMessage.sender !== nextarr.sender && chatMessage.sender === prevarr.sender){ // if bottom of sandwhich 
                    return <span className = 'incoming_message_sandwich_container' key={index}><span className = 'incoming_message_bottom' key={index} >{chatMessage.message}</span><span className ='sentby'>{chatMessage.sender}</span></span> 
                }else{
                    return <span className = 'incoming_message_container' key={index}><span className = 'incoming_message' key={index} >{chatMessage.message}</span><span className ='sentby'>{chatMessage.sender}</span></span> 
                }
            }else{
                return <span className = 'incoming_message_container' key={index}><span className = 'incoming_message' key={index} >{chatMessage.message}</span><span className ='sentby'>{chatMessage.sender}</span></span> 
            }  
        }else if (chatMessage.sender === dashdata.user.username){
            return <span className = 'users_message_container' key={index} ><span className = 'users_message'>{chatMessage.message}</span></span>
        }
    })
    
}

export default Chatroom