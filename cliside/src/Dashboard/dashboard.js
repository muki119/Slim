import React, { createContext,useContext, useEffect, useState ,useReducer} from 'react';
import {
    Redirect
} from "react-router-dom";
import UdContext from '../usercontext/usercontext';
import Messagecontext from './messagecontext';
import Axios from 'axios'
import './dashboard.css';
import '../general_css/gcss.css';
import { io } from "socket.io-client" ; 
import _ from 'lodash';
import Chatroom from './conversation_component/Chatroom';


function Dashboard (props){
    const {urdata,setUser} = useContext(UdContext) // use this to set user data and pull userdata
    const [logout,setlog] = useState(false)
    const [chats,setchats] = useState({data:[]})
    const [currentchatid,changechat] = useState('booom bow') // the id of the 
    const [socket,setsocket]=useState(null)
    const [roomidarr,sridarr]  = useState([])
    document.title = 'Dashboard'
    const dashdata = JSON.parse(localStorage.getItem('UD')) // login persistence data
    const [,forceUpdate] = useReducer(x => x + 1, 0); // force update 
    
    function logoutproc(){ // log out process
        localStorage.clear()
        socket.disconnect()
        setlog(true) // do every thing above before this because this redirects to login
    }

    function chatchanger(e){ // changes the chat 
        changechat(e.target.id)
    }

    useEffect(()=>{ // establishes ws socket connection and gets all availabele chats of user 
        const newsocket = io('ws://localhost:8210'); // URL WILL BE FROM .ENV
        setsocket(newsocket)

        //console.log('dome') 
        async function get_chats(){ // get the user's chats 
            try {
                var chat= await Axios.post('http://localhost:25565/api/m/getmsgs',{username:dashdata.user.username})  // URL WILL BE FROM .ENV+ROUTE
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
                console.log(e)
                sridarr(roomidarr=>[...roomidarr,e.chat_id]) 
            })
        }  
        return ()=>{sridarr([])} 
    },[chats])

    useEffect(()=>{ // joins rooms once everything is established - if the user also has no rooms then the function will not run 
        if (roomidarr !== [] && socket !== null){
            socket.emit('join_rooms',roomidarr,'kachow')
            console.log(roomidarr)
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
            
            var convomp = chats.data.map((eh,index)=>{
                var usersinvolved = [(eh.users_involved.slice(0,eh.users_involved.indexOf(dashdata.user.username))).toString(),(eh.users_involved.slice(eh.users_involved.indexOf(dashdata.user.username)+1)).toString()] // removes the users name from the available recipients list 
                return <span key = {index} id={eh.chat_id} onClick={chatchanger}><span class= 'chatname'>{usersinvolved.map((users)=>{return users+' '})}</span></span> // id for the chat_id used -chatchanger is a function that changes the conversation by making the new one a 
            })

            return(
                <div class = 'dbackground' >
                    <div class='dinbox'>

                        <div class ='topbar'>

                            <span id='barwelcome'>{dashdata.user.firstname.charAt(0).toUpperCase()+dashdata.user.firstname.slice(1)} {dashdata.user.surname} ( {dashdata.user.username} )</span> 
                            <button id='lout'onClick={logoutproc}>Logout</button>
                            
                        </div>

                        <div class = 'chatandbar'>

                            <div class = 'chatbar'>
                                <span><span class= 'chatname'>{dashdata.user.firstname} {dashdata.user.surname}</span></span>
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
                <Redirect push to = '/login' />
            )

        }  
    }else{
        return(
            <Redirect push to = '/login' />
        )
    }
    

}
 

export default Dashboard