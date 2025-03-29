import React, {useEffect, useState , useContext, useCallback} from 'react';
import { Snackbar,Alert} from '@mui/material';
import {
    Navigate as Redirect
} from "react-router-dom";
import moment from 'moment'
import './dashboard.css';
import '../general_css/gcss.css';
import { io, Socket } from "socket.io-client" ; 
import Chatroom from './conversation_component/Chatroom';
import ChatBar from './chatbarComponent/chatbar.js';
import CreateChat from './create-chat-component/createchat'
import NavigationBar from './navigationBar/navigationBar';
import AvailableConversationTiles from'./chatbarComponent/AvailableConversationIcon.js'
import axios from 'axios';
import { ThemeContext } from '../ThemeContext';


interface Conversation{
    users_involved:string[];
    chat_id:string;
    chat_name:string;
    date_created:string;
    last_messaged:string;
    messages:Message[];
}
interface Message{
    sender:string;
    message:string;
    timesent:string;
}
interface ServerToClientEvents {
    noArg: () => void;
    basicEmit: (a: number, b: string, c: Buffer) => void;
    withAck: (d: string, callback: (e: number) => void) => void;
}
  
interface ClientToServerEvents {
    hello: () => void;
}



export default function Dashboard(){
    //const {urdata,setUser} = useContext(UdContext) // use this to set user data and pull userdata
    // @ts-ignore
    //const dashdata:any= JSON.parse(localStorage.getItem('UD')) // login persistence data
    const [dashdata,] = useState<any>(JSON.parse(localStorage.getItem('UD')))
    const [logout,setlog] = useState(false) // if set to true the user wil be logged out
    const [availableConversations,setchats] = useState<Conversation[]|any[]>([]) // all the conversations 
    const [currentchatid,changechat] = useState('') // the id of the 
    const [socket,setsocket]:any=useState(null) // variable for the socket 
    const [roomidarr,setRoomIdArray]  = useState<string[]>([]) // array of chatids to be used as room id's
    const [displaycc,setcc]= useState(false)  //display create conversation   
    const [success_cc,sets_cc]=useState(false) // on successfull creation this is turnt to true - this causes a pop-up  that the app has been created
    const [failed_cc,setf_cc]=useState(false) // on a failed creation of chat this will be toggled to true - causing the failed creation alleart to be displayed 
    const [openMenu,setOpenMenu] = useState(false)
    const {currentTheme,setcurrentThemeFunc} = useContext(ThemeContext)
    const [openChatbar,setopenChatbar]=useState(true)// open chat bar on the right if true then it would be open 

    axios.defaults.withCredentials=true // makes it so that cookies are sent with every request. 
    
    async function logoutProcessFunction():Promise<void>{ // log out process
        localStorage.removeItem("UD") // clears users basic data 
        await axios.delete(`${process.env.REACT_APP_API_URL}/misc/removecookie`) // deletes cookies
        if(socket!== null){socket.disconnect()}
        setlog(true) // do every thing above before this because this redirects to login
    }
    const logoutProcess = useCallback(logoutProcessFunction,[socket])

    const opencb = useCallback(():void =>{ // opens and closes the chatbar 
        setopenChatbar(!openChatbar)   
    },[openChatbar])

    const chatchanger = useCallback((e:any):void =>{ // changes the chat 
        changechat(e.currentTarget.dataset.chatid)
        //opencb()
    },[])

    const joinrooms = useCallback(()=>{ // function that joins the roos 
        socket.emit('join_rooms',roomidarr) // emits join_rooms event to server and attaches room id array. This attempts to join all rooms in array.  // needs callback 
    },[roomidarr, socket])

    const loadchats = useCallback(()=>{ // gets chat ids and adds them to an array to be sent to the server so the user can join the availableConversations and recieve messages 
        setRoomIdArray(roomidarr=>[dashdata.user.username]) // connect to private rooms  // adds users name to array  -- their username will be used to send created availableConversations  ,involving them, ,by other users to them
        availableConversations.forEach((e:any)=>{
            setRoomIdArray(roomidarr=>[...roomidarr,e.chat_id]) 
        })
    },[availableConversations, dashdata.user.username])
    
    async function getChats(){ // get the user's availableConversations 
        try {
            var chat= await axios.post(`${process.env.REACT_APP_API_URL}/m/getmsgs`,{username:dashdata.user.username})  //gets messages from the server .  // http post request 
            if (chat.data.validjwt === false){ // if invalid jwt then logout
                logoutProcess()
            }else{
               setchats(chat.data) 
            }
        }catch(error){
            console.error("Error fetching chats:", error);
        }
    }
    useEffect(()=>{ // establishes ws socket connection and gets all availabele availableConversations of user 
        document.title = 'Dashboard'
        const newsocket:Socket<ServerToClientEvents, ClientToServerEvents> = io(`${process.env.REACT_APP_SOCKET_URL}`); // URL WILL BE FROM .ENV
        setsocket(newsocket) // variable asignment 
        getChats() //calls the getChats function 
        if (Notification.permission !== "denied"){Notification.requestPermission()} // allows the sending of notifications
        return ()=>{newsocket.close()} // once the dashboard closes the socket will be disconnected  - cleanup function
    },[])

    useEffect(()=>{
        //console.log("changin") // if theres availableConversations found that the user is a part of - the chat ids will be gathered and used as seperate socket rooms 
        if (availableConversations.length>0){
            loadchats()
        }  
        return ()=>{setRoomIdArray([])} 
    },[availableConversations, loadchats])

    useEffect(()=>{ // joins rooms once everything is established - if the user also has no rooms then the function will not run 
        if (roomidarr.length>1 && socket !== null){
            joinrooms()
            socket.on("disconnect",(reason:any)=>{ // if theres a disconnection to the servers  // notification 
                if(reason==="transport close" || reason === "transport error"){ // and the reason is due to a lost connection or a netowkr error 
                    joinrooms(); // try to rejoin the rooms 
                }
            })
        }
    },[socket, roomidarr, joinrooms])

    useEffect(()=>{ // listens for a new conversation
        if (socket !== null){
            socket.on("new_chat",(conv:Conversation)=>{
                setchats([...availableConversations,conv]) // appending to array
                socket.emit('join_rooms',conv.chat_id) // needs callback //notification 
                new Notification(`You have Been added to ${conv.chat_name}!`)
                //forceUpdate()
            })
            return(()=>{
                socket.off("new_chat")
            })
        }
        
    },[socket,availableConversations])

    useEffect(()=>{console.log(availableConversations)},[availableConversations])
   

    const SortDisplay = useCallback(() => {
        try {
            return availableConversations
                .slice()
                .sort((a, b) => Date.parse(b.last_messaged) - Date.parse(a.last_messaged))
                .map((conversation, index) => (

                    
                    <AvailableConversationTiles
                        key={conversation.chat_id}
                        {...{
                            dashdata,
                            conversation,
                            chatchanger,
                            chatName: conversation.chat_name,
                            usersinvolved: conversation.users_involved,
                            lastMessaged: moment(conversation.last_messaged).fromNow(),
                            availableConversations,
                            setchats
                        }}
                    />
                ));
        } catch (error) {
            console.error("Error sorting and displaying conversations:", error);
            // Handle error gracefully, maybe show a notification to the user
            return null;
        }
    }, [availableConversations, dashdata, chatchanger, setchats]);
    

    if(!dashdata||logout===true){return <Redirect  to = '/login' /> } // logsout  if not data is in the localstorage or logout was set to true 
    var convomp = SortDisplay()
    return(
        <>
            <div className = 'dbackground' >
                    <div className='dinbox'>

                        {displaycc? <CreateChat {...{availableConversations,setchats,displaycc,setcc,socket,sets_cc,logoutProcess,setf_cc}}/>:null} {/* displays the create availableConversations menu when the displaycc value is == true  */}
                        
                        <NavigationBar {...{setOpenMenu, dashdata, openMenu, setcurrentThemeFunc, currentTheme, logoutProcess ,opencb,openChatbar}}/>

                        <div className = 'chatandbar'>
                            {openChatbar && <ChatBar {...{setcc, displaycc, convomp}} />}{/*Displays the chatbar component */}
                            <div className = 'openchat'>
                                <Chatroom {...{availableConversations,setchats,currentchatid,socket,setsocket}}/>{/*displays chatroom */}
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
        </>
    )

}
 








