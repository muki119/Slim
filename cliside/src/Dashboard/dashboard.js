import React, { createContext,useContext, useEffect, useState } from 'react';
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


function Dashboard (props){
    const {urdata,setUser} = useContext(UdContext) // use this to set user data and pull userdata
    const [logout,setlog] = useState(false)
    const [chats,setchats] = useState({data:[]})
    const [currentchatid,changechat] = useState('booom bow') // the id of the 
    document.title = 'Dashboard'
    const dashdata = JSON.parse(localStorage.getItem('UD'))

    const socket = io('http://localhost:8210');

 
    useEffect(()=>{
        socket.emit('join_rooms','tme','yooo')
        console.log('dome')
        async function get_chats(){ // get the user's chats 
            try {
                var chat= await Axios.post('http://localhost:25565/api/m/getmsgs',{username:dashdata.user.username}) 
                //bubble sort the chats by time and get each 
                setchats(chat)
            } catch (error) {
                console.log(error)
            }
            
        }
        get_chats()
    },[])
 
    
    function logoutproc(){
        localStorage.clear()
        socket.close()
        setlog(true) // do every thing above before this because this redirects to login
    }
    function chatchanger(e){
        changechat(e.target.id)
    }

    if (dashdata){
        if (dashdata.redirect === false){ // if not authorized 

            return(
                <Redirect push to = '/login' />
            )

        }else if (dashdata.redirect === true ){ // if there is a redirect allowance 
            var convo = chats.data.map((eh,index)=>{
                var usersinvolved = [(eh.users_involved.slice(0,eh.users_involved.indexOf(dashdata.user.username))).toString(),(eh.users_involved.slice(eh.users_involved.indexOf(dashdata.user.username)+1)).toString()]
                //console.log(usersinvolved)
                return <span key = {index} id= {eh.chat_id} onClick={chatchanger}><span class= 'chatname'>{usersinvolved.map((users)=>{return users+' '})}</span></span>
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
                                {convo}
                            </div>
                            <div class = 'openchat'>
                                <Messagecontext.Provider value = {{chats,setchats,currentchatid}}>
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
 

function Chatroom(){
    const {chats,setchats,currentchatid} = useContext(Messagecontext)
    const p = chats.data.findIndex((e)=>{return e.chat_id == currentchatid})
    const currentchat = chats.data[p] // change the contents using setchats

    console.log(p)
    return (


        <div>
            <div class = 'top'>{JSON.stringify(p)}</div>
            <div>{JSON.stringify(currentchat)}</div>
        </div>
    )
}
export default Dashboard