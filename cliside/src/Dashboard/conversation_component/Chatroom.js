import React, {useEffect, useState} from 'react';
//import UdContext from '../usercontext/usercontext';
import '../dashboard.css';
import './chatroom.css'
import ScrollableFeed from 'react-scrollable-feed'
import TextareaAutosize from 'react-textarea-autosize';
import $ from "jquery";
import {IncomingMessage} from './Messages';


function Chatroom({availableConversations,setchats,currentchatid,socket,setsocket,forceUpdate}){ // this is wwhere the messages are displayed from 
//availableConversations are all the available availableConversations from the users account -setchats is for updating when a message comes in or when you send a message - cchat_id to find the chat the user selected - socket are for realtime connection    
    const [message,setmessage]=useState('')
    const dashdata = JSON.parse(localStorage.getItem('UD'))
    
    function sendmsg(){
        if (message.length > 0 || message.trim().length !== 0){
            try {
                const messageObject = { // message object to be sent 
                    sender:dashdata.user.username,
                    message:message,
                    timesent:new Date(Date.now()).toISOString() // gets the time the message was sent 
                }
                socket.emit('sendMessage',currentchatid,messageObject,(response)=>{
                    // on successfull eddit the object to also have a successfull tick // else it would have a (x) or a (!) telling to retry 
                }) // change to get username
                const indx = availableConversations.findIndex((e)=>{return e.chat_id === currentchatid}) // current chat index in array
                const cht = availableConversations
                cht[indx].messages.push(messageObject) // appending to array 
                cht[indx].last_messaged = new Date(Date.now()).toISOString()
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
        //add message to availableConversations state
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
                    const indx = availableConversations.findIndex((e)=>{return e.chat_id === room})  //finds index of chat where chat id == room 
                    const cht = availableConversations
                    cht[indx].messages.push(incmessage) // adds message to array to be displayed 
                    cht[indx].last_messaged = new Date(Date.now()).toISOString()
                    currentchatid !== room && new Notification(`New message in ${cht.data[indx].chat_name}`,{"body":`From ${incmessage.sender}`})
                } catch (error) {
                    return error
                }

            }
        }
        
    },[socket, availableConversations, forceUpdate])

    if (availableConversations.length !== 0 && socket!== null ){ // if the user has available availableConversations 

        const p = availableConversations.findIndex((e)=>{return e.chat_id === currentchatid}) // finds
        const currentchat = availableConversations[p] // change the contents using setchats

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
                        <div className='messageInputBoxContainer'>
                            <TextareaAutosize id = 'text_area' value={message} placeholder='Type something here :)' onChange={(e)=>{setmessage(e.target.value)}} minRows={1}></TextareaAutosize>  
                            <div className='sendButtonContainer' >
                                <button id='sendbtn'onClick={sendmsg}>Send</button>
                            </div>
                             
                        </div>
                        
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
                    <h1>No available Chats</h1>
                    <h2>Create a chat</h2>
                </div>
            </>
        )
    }
}

function mapAllMessages(currentcmsgs,dashdata){ // this function displays the messages
    return currentcmsgs.map((chatMessage,index,arr)=>{ // this maps the incoming messages and users messages
        var previousMessage = arr[index-1]
        var nextMessage = arr[index+1]
        if (chatMessage.sender !== dashdata.user.username){ // if the sender 
            if (index>0 && index!==(arr.length-1)){
                if (chatMessage.sender === nextMessage.sender && chatMessage.sender !== previousMessage?.sender){ /// if its the top of the sandwhich
                    return <IncomingMessage keynum={index} message={chatMessage.message} position={"top"}/>
                }else if (chatMessage.sender === nextMessage.sender && chatMessage.sender === previousMessage.sender){ // if middle of sandwhich 
                    return <IncomingMessage keynum={index} message={chatMessage.message} position={"middle"}/>
                }else if ((chatMessage.sender !== nextMessage.sender)&&chatMessage.sender === previousMessage.sender){ // if bottom of sandwhich
                    return <IncomingMessage keynum={index} message={chatMessage.message} position={"bottom"} sender={chatMessage.sender}/>
                }else{ // standalone
                    return <IncomingMessage keynum={index} message={chatMessage.message} sender={chatMessage.sender}/>
                }
            }else{ // for the beginning and end elements of the arrays 
                if (nextMessage === undefined &&chatMessage.sender === previousMessage?.sender){ //if at the bottom of the text
                    return <IncomingMessage keynum={index} message={chatMessage.message} position={"bottom"} sender={chatMessage.sender}/>
                }else if (nextMessage?.sender === chatMessage.sender && !previousMessage) { // if at the top and its 
                    return <IncomingMessage keynum={index} message={chatMessage.message} position={"top"}/>
                }else{ //standalone 
                    return <IncomingMessage keynum={index} message={chatMessage.message} sender={chatMessage.sender}/>
                }
            }
        }else if (chatMessage.sender === dashdata.user.username){
            return <span className = 'users_message_container' key={index} ><span className = 'users_message'>{chatMessage.message}</span></span>
        }else{
            return null
        }
    })
    
}

export default Chatroom