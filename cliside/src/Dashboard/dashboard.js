import React, { createContext,useContext, useEffect, useState ,useReducer} from 'react';
import {
    Redirect
} from "react-router-dom";
import UdContext from '../usercontext/usercontext';
import Messagecontext from './messagecontext';
import CreateChatContext from './create-chat-component/c2context'
import Axios from 'axios'
import './dashboard.css';
import '../general_css/gcss.css';
import { io } from "socket.io-client" ; 
import _ from 'lodash';
import Chatroom from './conversation_component/Chatroom';
import CreateChat from './create-chat-component/createchat'

function Dashboard (props){
    const {urdata,setUser} = useContext(UdContext) // use this to set user data and pull userdata
    const [logout,setlog] = useState(false)
    const [chats,setchats] = useState({data:[]})
    const [currentchatid,changechat] = useState('booom bow') // the id of the 
    const [socket,setsocket]=useState(null)
    const [roomidarr,sridarr]  = useState([])
    const [displaycc,setcc]= useState(false)    
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
                //bubble sort the chats by time and get each 
                setchats(chat)
            } catch (error) {
                console.log(error)
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
    },[roomidarr])



    
    if (dashdata){
        if (dashdata.redirect === false){ // if not authorized 

            return(
                <Redirect push to = '/login' />
            )

        }else if (dashdata.redirect === true ){ // if there is a redirect allowance 

            
            const sortalgor = (a,b)=>{
                //console.table(Date.parse(b.last_messaged))
                return Date.parse(a.last_messaged)-Date.parse(b.last_messaged)
            }
            var sk  = chats.data
            sk.sort(sortalgor) // sorts the chats by last messaged 
            sk.reverse()
            
            var convomp = chats.data.map((eh,index)=>{ // maps the lists into tiles clickable tiles
                var usersinvolved = [(eh.users_involved.slice(0,eh.users_involved.indexOf(dashdata.user.username))).toString(),(eh.users_involved.slice(eh.users_involved.indexOf(dashdata.user.username)+1)).toString()] // removes the users name from the available recipients list 
                return <div key = {index}id={eh.chat_id} onClick={chatchanger} tabIndex={0}><p onClick={(e)=>{e.preventDefault() }}class= 'chatname'>{usersinvolved.map((users)=>{return users+' '})}</p></div> // id for the chat_id used -chatchanger is a function that changes the conversation by making the new one a 
            })

            return(
                <div class = 'dbackground' >
                    <div class='dinbox'>
                        {displaycc === true && <CreateChatContext.Provider value={{chats,setchats,displaycc,setcc}}><CreateChat/></CreateChatContext.Provider>}
                        <div class ='topbar'>

                            <span id='barwelcome'>{dashdata.user.firstname.charAt(0).toUpperCase()+dashdata.user.firstname.slice(1)} {dashdata.user.surname} ( {dashdata.user.username} )</span> 
                            <button tabIndex={1} id='lout'onClick={logoutproc}>Logout</button>
                            
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
                </div>
            )

        }
        else if(logout === true) {
            return(
                <Redirect push to = '/' />
            )

        }  
    }else{
        return(
            <Redirect push to = '/' />
        )
    }
    

}
 

export default Dashboard