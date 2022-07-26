import React, {useEffect, useState ,useReducer, useContext} from 'react';
import { Snackbar,Alert} from '@mui/material';
import {
    Redirect
} from "react-router-dom";
import moment from 'moment'

import './dashboard.css';
import '../general_css/gcss.css';

import { io } from "socket.io-client" ; 
import Chatroom from './conversation_component/Chatroom';
import ChatBar from './chatbarComponent/chatbar.js';
import CreateChat from './create-chat-component/createchat'
import NavigationBar from './navigationBar/navigationBar';
import {AvailableConversationTiles} from'./chatbarComponent/AvailableConversationIcon.js'
import axios from 'axios';
import { ThemeContext } from '../ThemeContext';




function Dashboard (){
    //const {urdata,setUser} = useContext(UdContext) // use this to set user data and pull userdata
    const dashdata = JSON.parse(localStorage.getItem('UD')) // login persistence data
    const [logout,setlog] = useState(false) // if set to true the user wil be logged out
    const [chats,setchats] = useState({data:[]}) // all the conversations 
    const [currentchatid,changechat] = useState('') // the id of the 
    const [socket,setsocket]=useState(null) // variable for the socket 
    const [roomidarr,setRoomIdArray]  = useState([]) // array of chatids to be used as room id's
    const [displaycc,setcc]= useState(false)  //display create conversation   
    const [success_cc,sets_cc]=useState(false) // on successfull creation this is turnt to true - this causes a pop-up  that the app has been created
    const [failed_cc,setf_cc]=useState(false) // on a failed creation of chat this will be toggled to true - causing the failed creation alleart to be displayed 
    const [,forceUpdate] = useReducer(x => x + 1, 0); // forces update
    const [openMenu,setOpenMenu] = useState(false)
    const {currentTheme,setcurrentThemeFunc} = useContext(ThemeContext)
    const [openChatbar,setopenChatbar]=useState(true)// open chat bar on the right if true then it would be open 
    axios.defaults.withCredentials=true // makes it so that cookies are sent with every request. 
    
    async function logoutproc(){ // log out process
        localStorage.clear() // clears users basic data 
        await axios.delete(`${process.env.REACT_APP_API_URL}/misc/removecookie`) // deletes cookies
        if(socket!== null){socket.disconnect()}
        setlog(true) // do every thing above before this because this redirects to login
    }
    function opencb(){
        setopenChatbar(!openChatbar)   
    }

    function chatchanger(e){ // changes the chat 
        changechat(e.currentTarget.dataset.chatid)
    }

    function joinrooms(){
        socket.emit('join_rooms',roomidarr) // emits join_rooms event to server and attaches room id array. This attempts to join all rooms in array. 
    }
    function loadchats(){
        setRoomIdArray(roomidarr=>[dashdata.user.username]) // connect to private rooms  // adds users name to array  -- their username will be used to send created chats  ,involving them, ,by other users to them
        chats.data.forEach((e)=>{
            setRoomIdArray(roomidarr=>[...roomidarr,e.chat_id]) 
        })
    }
    async function get_chats(){ // get the user's chats 
        try {
            var chat= await axios.post(`${process.env.REACT_APP_API_URL}/m/getmsgs`,{username:dashdata.user.username})  //gets messages from the server .  // http post request 
            if (chat.data.validjwt === false){ // if invalid jwt then logout
                logoutproc()
            }else{
               setchats(chat) 
            }
        }catch{
            
        }
    }


    useEffect(()=>{ // establishes ws socket connection and gets all availabele chats of user 
        document.title = 'Dashboard'
        const newsocket = io(`${process.env.REACT_APP_SOCKET_URL}`); // URL WILL BE FROM .ENV
        setsocket(newsocket) // variable asignment 
        get_chats() //calls the get_chats function 
        return ()=>{newsocket.close()} // once the dashboard closes the socket will be disconnected  - cleanup function
    },[])

    useEffect(()=>{ // if theres chats found that the user is a part of - the chat ids will be gathered and used as seperate socket rooms 
        if (chats.data !== [] ){
            loadchats()
        }  
        return ()=>{setRoomIdArray([])} 
    },[chats])

    useEffect(()=>{ // joins rooms once everything is established - if the user also has no rooms then the function will not run 
        if (roomidarr !== [] && socket !== null){
            joinrooms()
            socket.on("disconnect",(reason)=>{ // if theres a disconnection to the servers 
                if(reason==="transport close" || reason === "transport error"){ // and the reason is due to a lost connection or a netowkr error 
                    joinrooms(); // try to rejoin the rooms 
                }
            })
        }
    },[socket,roomidarr])

    useEffect(()=>{ // listens for a new conversation
        if (socket !== null){
            socket.on("new_chat",(conv)=>{
                chats.data.push(conv) // appending to array
                socket.emit('join_rooms',conv.chat_id)
                forceUpdate()
            })
            return(()=>{
                socket.off()
            })
        }
        
    },[socket,chats,forceUpdate])

    function sort_display(){ // sort messages and  display them
        const sortAlgorithm = (a,b)=>{
            return Date.parse(b.last_messaged)-Date.parse(a.last_messaged)
        }
        
        var sk  = chats.data
        sk.sort(sortAlgorithm) // sorts the chats by last messaged 

        return chats.data.map((conversation,index)=>{ // maps the lists into tiles clickable tiles 
            var lastMessaged = moment(conversation.last_messaged).fromNow() // finds the time since last messaged - turns it into 
            var usersinvolved = [(conversation.users_involved.slice(0,conversation.users_involved.indexOf(dashdata.user.username))).toString(),(conversation.users_involved.slice(conversation.users_involved.indexOf(dashdata.user.username)+1)).toString()] // removes the users name from the available recipients list 
            var chatName = conversation.chat_name
            return <AvailableConversationTiles {...{index, conversation, chatchanger, chatName, usersinvolved, lastMessaged,chats}}/> // id for the chat_id used -chatchanger is a function that changes the conversation by making the new one a 
        })
    }

    
    if (dashdata && logout!== true){
        if (dashdata.redirect === false){ // if not authorized 
            return(
                <Redirect push to = '/login' />
            )
        }else if (dashdata.redirect === true ){ // if there is a redirect allowance 
            var convomp = sort_display()
            return(
               <>
                    {logout === false && 
                        <div className = 'dbackground' >
                                <div className='dinbox'>

                                    {displaycc? <CreateChat {...{chats,setchats,displaycc,setcc,forceUpdate,socket,sets_cc,logoutproc,setf_cc}}/>:null} {/* displays the create chats menu when the displaycc value is == true  */}
                                    
                                    <NavigationBar {...{setOpenMenu, dashdata, openMenu, setcurrentThemeFunc, currentTheme, logoutproc ,opencb,openChatbar}}/>

                                    <div className = 'chatandbar'>
                                        {openChatbar?<ChatBar {...{setcc, displaycc, convomp}} />:<></>}{/*Displays the chatbar component */}
                                        <div className = 'openchat'>
                                            <Chatroom {...{chats,setchats,currentchatid,socket,setsocket,forceUpdate}}/>{/*displays chatroom */}
                                        </div>
                                    </div>

                                </div>

                                <Snackbar open={success_cc}  onClose={(e,reason)=>{if (reason === "timeout" || reason=== 'clickaway'){sets_cc(false)}}} autoHideDuration={5000}> 
                                    <Alert severity="success" sx={{backgroundColor:'#39386f',color:'#eeeeee',fontWeight:500}}>Conversation has successfully been created.</Alert>
                                </Snackbar>    

                                <Snackbar open={failed_cc} onClose={(e,reason)=>{if (reason === "timeout" || reason=== 'clickaway'){setf_cc(false)}}} autoHideDuration={5000}>
                                    <Alert severity="error">Unable to create Conversation.Please try again later</Alert>
                                </Snackbar>

                        </div>
                    }
                    {logout === true && <Redirect push to = '/login' /> }
                </>
            )
        }
    }else{
        return(
            <Redirect push to = '/login' />
        )
    }
    

}
 

export default Dashboard






