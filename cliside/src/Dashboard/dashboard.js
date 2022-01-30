import React, {useContext, useEffect, useState ,useReducer} from 'react';
import {
    Redirect
} from "react-router-dom";
import UdContext from '../usercontext/usercontext';
import Messagecontext from './messagecontext';
import CreateChatContext from './create-chat-component/c2context'
import Axios from 'axios'

import moment from 'moment'
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import './dashboard.css';
import '../general_css/gcss.css';

import { io } from "socket.io-client" ; 
import Chatroom from './conversation_component/Chatroom';
import CreateChat from './create-chat-component/createchat'



function Dashboard (props){
    //const {urdata,setUser} = useContext(UdContext) // use this to set user data and pull userdata
    const [logout,setlog] = useState(false)
    const [chats,setchats] = useState({data:[]})
    const [currentchatid,changechat] = useState('') // the id of the 
    const [socket,setsocket]=useState(null)
    const [roomidarr,sridarr]  = useState([])
    const [displaycc,setcc]= useState(false)  //display create conversation   
    const [success_cc,sets_cc]=useState(false) // on successfull creation this is turnt to true - this causes a pop-up  that the app has been created
    const [failed_cc,setf_cc]=useState(false)
    const dashdata = JSON.parse(localStorage.getItem('UD')) // login persistence data
    const [,forceUpdate] = useReducer(x => x + 1, 0); // force update 
    
    function logoutproc(){ // log out process
        localStorage.clear()
        socket.disconnect()
        setlog(true) // do every thing above before this because this redirects to login
    }

    function chatchanger(e){ // changes the chat 
        changechat(e.currentTarget.id)
    }

    useEffect(()=>{ // establishes ws socket connection and gets all availabele chats of user 
        document.title = 'Dashboard'
        const newsocket = io(`${process.env.REACT_APP_SOCKET_URL}`); // URL WILL BE FROM .ENV
        setsocket(newsocket)

        //console.log('dome') 
        async function get_chats(){ // get the user's chats 
            try {
                var uat = localStorage.getItem("Uat")
                var chat= await Axios.post(`${process.env.REACT_APP_API_URL}/api/m/getmsgs`,{username:dashdata.user.username,Uat:uat})  // URL WILL BE FROM .ENV+ROUTE
                if (chat.data.validjwt === false){
                    logoutproc()
                }else{
                   setchats(chat) 
                }
            } catch {
                
            } 
        }
        get_chats() //calls the get_chats function 
        return ()=>{newsocket.close()} // once the dashboard closes the socket will be disconnected  - cleanup function
    },[])

    useEffect(()=>{ // if theres chats found that the user is a part of - the chat ids will be gathered and used as seperate socket rooms 
        if (chats.data !== [] ){
            chats.data.forEach((e)=>{
                //console.log(e)
                sridarr(roomidarr=>[...roomidarr,e.chat_id]) 
            })
        }  
        return ()=>{sridarr([])} 
    },[chats])

    useEffect(()=>{ // joins rooms once everything is established - if the user also has no rooms then the function will not run 
        if (roomidarr !== [] && socket !== null){
            socket.emit('join_rooms',roomidarr)
            //console.log(roomidarr)
        }
    },[socket,roomidarr])



    
    if (dashdata){
        if (dashdata.redirect === false){ // if not authorized 

            return(
                <Redirect push to = '/login' />
            )

        }else if (dashdata.redirect === true ){ // if there is a redirect allowance 

            
            const sortalgor = (a,b)=>{
                //console.table(Date.parse(b.last_messaged))
                return Date.parse(b.last_messaged)-Date.parse(a.last_messaged)
            }
            var sk  = chats.data
            sk.sort(sortalgor) // sorts the chats by last messaged 
            
            var convomp = chats.data.map((element,index)=>{ // maps the lists into tiles clickable tiles 
                //console.log(element)
                var lastmessaged = moment(element.last_messaged).fromNow() // finds the time since last messaged - turns it into 
                var usersinvolved = [(element.users_involved.slice(0,element.users_involved.indexOf(dashdata.user.username))).toString(),(element.users_involved.slice(element.users_involved.indexOf(dashdata.user.username)+1)).toString()] // removes the users name from the available recipients list 
                return <div key = {index}id={element.chat_id} onClick={chatchanger} tabIndex={0}><p class= 'chatname'>{usersinvolved.map((users)=>{return users+' '})}</p><span class ='last_messaged'>Last Messaged:{lastmessaged}</span></div> // id for the chat_id used -chatchanger is a function that changes the conversation by making the new one a 
            })

            return(
                <div class = 'dbackground' >
                    <div class='dinbox'>
                        {displaycc === true && <CreateChatContext.Provider value={{chats,setchats,displaycc,setcc,forceUpdate,socket,sets_cc,logoutproc,setf_cc}}><CreateChat/></CreateChatContext.Provider>}
                        <div class ='topbar'>

                            <span id='barwelcome'>{dashdata.user.firstname.charAt(0).toUpperCase()+dashdata.user.firstname.slice(1)} {dashdata.user.surname} ( {dashdata.user.username} )</span> 
                            <button tabIndex={0} id='lout'onClick={logoutproc}>Logout</button>
                            
                        </div>

                        <div class = 'chatandbar'>
                            <div class = 'chatbar'>
                                <div><span class= 'chatname'>{dashdata.user.firstname} {dashdata.user.surname}</span></div>
                                <div class  = "chatbtnouter"><span class ='create_chat_btn'><button onClick={()=>{setcc(!displaycc)}}>Create chat</button></span></div>
                                {convomp}
                            </div>

                            <div class = 'openchat'>
                                <Messagecontext.Provider value = {{chats,setchats,currentchatid,socket,setsocket,forceUpdate}}>
                                    <Chatroom/>
                                </Messagecontext.Provider>
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
            )

        }
        else if(logout === true) {
            return(
                <Redirect push to = '/login' />
            )

        }  
    }else{
        return(
            <Redirect push to = '/' />
        )
    }
    

}
 

export default Dashboard