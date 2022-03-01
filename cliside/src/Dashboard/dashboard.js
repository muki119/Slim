import React, {useEffect, useState ,useReducer} from 'react';
import {
    Redirect
} from "react-router-dom";
import Axios from 'axios'

import moment from 'moment'
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import './dashboard.css';
import '../general_css/gcss.css';

import { io } from "socket.io-client" ; 
import Chatroom from './conversation_component/Chatroom';
import ChatBar from './chatbar.js';
import CreateChat from './create-chat-component/createchat'
import axios from 'axios';



function Dashboard (){
    //const {urdata,setUser} = useContext(UdContext) // use this to set user data and pull userdata
    const dashdata = JSON.parse(localStorage.getItem('UD')) // login persistence data
    const [logout,setlog] = useState(false)
    const [chats,setchats] = useState({data:[]})
    const [currentchatid,changechat] = useState('') // the id of the 
    const [socket,setsocket]=useState(null)
    const [roomidarr,sridarr]  = useState([])
    const [displaycc,setcc]= useState(false)  //display create conversation   
    const [success_cc,sets_cc]=useState(false) // on successfull creation this is turnt to true - this causes a pop-up  that the app has been created
    const [failed_cc,setf_cc]=useState(false)
    const [,forceUpdate] = useReducer(x => x + 1, 0); // force update 
    
    async function logoutproc(){ // log out process
        localStorage.clear()
        await axios.delete(`${process.env.REACT_APP_API_URL}/api/misc/removecookie`) // deletes cookies
        socket.disconnect()
        setlog(true) // do every thing above before this because this redirects to login
    }

    function chatchanger(e){ // changes the chat 
        changechat(e.currentTarget.dataset.chatid)
    }
    function joinrooms(){
        socket.emit('join_rooms',roomidarr)
    }
    function loadchats(){
        sridarr(roomidarr=>[dashdata.user.username]) // connect to private room 
        chats.data.forEach((e)=>{
            sridarr(roomidarr=>[...roomidarr,e.chat_id]) 
        })
    }
    async function get_chats(){ // get the user's chats 
        try {
            var chat= await Axios.post(`${process.env.REACT_APP_API_URL}/api/m/getmsgs`,{username:dashdata.user.username})  // URL WILL BE FROM .ENV+ROUTE
            if (chat.data.validjwt === false){ // if invalid jwt then logout
                logoutproc()
            }else{
               setchats(chat) 
            }
        }catch{
            
        }
    }
    useEffect(()=>{},[logout])

    useEffect(()=>{ // establishes ws socket connection and gets all availabele chats of user 
        document.title = 'Dashboard'
        const newsocket = io(`${process.env.REACT_APP_SOCKET_URL}`); // URL WILL BE FROM .ENV
        setsocket(newsocket)
        get_chats() //calls the get_chats function 
        return ()=>{newsocket.close()} // once the dashboard closes the socket will be disconnected  - cleanup function
    },[])

    useEffect(()=>{ // if theres chats found that the user is a part of - the chat ids will be gathered and used as seperate socket rooms 
        if (chats.data !== [] ){
            loadchats()
        }  
        return ()=>{sridarr([])} 
    },[chats])

    useEffect(()=>{ // joins rooms once everything is established - if the user also has no rooms then the function will not run 
        if (roomidarr !== [] && socket !== null){
            joinrooms()
            socket.on("disconnect",(reason)=>{
                if(reason==="transport close" || reason === "transport error"){
                    joinrooms();
                }
            })
        }
    },[socket,roomidarr])

    useEffect(()=>{ // listens for a new conversation
        if (socket !== null){
            socket.on("new_chat",(conv)=>{
                chats.data.push(conv)
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
        return chats.data.map((element,index)=>{ // maps the lists into tiles clickable tiles 
            var lastMessaged = moment(element.last_messaged).fromNow() // finds the time since last messaged - turns it into 
            var usersinvolved = [(element.users_involved.slice(0,element.users_involved.indexOf(dashdata.user.username))).toString(),(element.users_involved.slice(element.users_involved.indexOf(dashdata.user.username)+1)).toString()] // removes the users name from the available recipients list 
            return <div key = {index} data-chatid={element.chat_id} onClick={chatchanger} tabIndex={0}><p className= 'chatname'>{usersinvolved.map((users)=>{return users+' '})}</p><span className ='last_messaged'>Last Messaged:{lastMessaged}</span></div> // id for the chat_id used -chatchanger is a function that changes the conversation by making the new one a 
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
                                    {displaycc === true && <CreateChat {...{chats,setchats,displaycc,setcc,forceUpdate,socket,sets_cc,logoutproc,setf_cc}}/>}
                                    <div className ='topbar'>
                                        <span id='barwelcome'>{dashdata.user.firstname.charAt(0).toUpperCase()+dashdata.user.firstname.slice(1)} {dashdata.user.surname} ( {dashdata.user.username} )</span> 
                                        <button tabIndex={0} id='lout'onClick={logoutproc}>Logout</button>
                                    </div>

                                    <div className = 'chatandbar'>
                                        <ChatBar  setcc={setcc} displaycc={displaycc} convomp={convomp}  />
                                        <div className = 'openchat'>
                                             <Chatroom {...{chats,setchats,currentchatid,socket,setsocket,forceUpdate}}/>
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