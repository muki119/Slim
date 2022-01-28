import React, { createContext,useContext, useEffect, useState ,useReducer,useCallback} from 'react';
import CreateChatContext from '../create-chat-component/c2context'
import Axios from 'axios'
import anime, { easings } from 'animejs'
import {debounce}  from 'lodash';
import './createchat.css'
import axios from 'axios';
import $ from "jquery"

export default function CreateChat(){
    const {chats,setchats,displaycc,setcc,forceUpdate,socket} = useContext(CreateChatContext) 
    const dashdata = JSON.parse(localStorage.getItem('UD'))
    const [selectedusers,setselected] = useState([dashdata.user.username])// array of the users selected 
    const [foundusers , setfoundusers] =useState([])
    const [adduserinput,setaui]=useState("")
   
    function closewindow(e){
        if (e.target.id === "dob"){
         setcc(!displaycc)
        }
    }
    async function displaysimilarusers(e){
        setaui(e.target.value)
        if ((e.target.value).length >= 2 ){
            const similar =await axios.post(`${process.env.REACT_APP_API_URL}/api/misc/getsimilar`,{username:e.target.value})
            setfoundusers(similar.data)
        }
        
    }
    async function addtoselected(e){
        var var2 = selectedusers.indexOf(e.currentTarget.id) 
        if (var2=== -1){
           setselected([...selectedusers,e.currentTarget.id]) 
        }  
    }
    async function createchatproc(){ //sends to backend
        if (selectedusers.length == 1 && selectedusers.indexOf(dashdata.user.username) == 0  ){
           
        }else if (selectedusers.length >1 ){
            try{
                const createconv =await axios.post(`${process.env.REACT_APP_API_URL}/api/m/createconversation`,{users_involved :selectedusers})
                    var success = createconv.data.success 
                    if (success == true ){ // if the creation was successful 
                        chats.data.unshift(createconv.data.chat) // add data to chat array so it can be viewsd in the tiles 
                        socket.emit('join_rooms',createconv.data.chat.chat_id)
                        console.log(chats.data)

                        forceUpdate()
                    }else if (createconv.success == false){
                        console.log('faliure')
                    }
            }catch{
                
            }
        }
        
    }

    const mappedfoundusers = foundusers.map((value,index)=>{ // mapps all the users found from api call
        return<span class ='similarusrscard'key={index} id = {value.username} onClick={(e)=>{addtoselected(e)}}><span class='foundusrsfn'>{value.firstname}</span ><span class="foundusrsun">{value.username}</span></span>
    })
    
    const debcall =useCallback(debounce((e)=>{displaysimilarusers(e)},700),[adduserinput])
    
    return(
    
    <div class ='dimopacitybackground'> 
        <background id = 'dob' onClick={(e)=>{closewindow(e)}}></background>
        <div class = "createchatformcontainer">
            <span class = 'add-userinput'><input placeholder='Input A Username' onChange={e=>{debcall(e)}}></input>{mappedfoundusers}</span> 
            <span class = 'recipiennts-list '>{JSON.stringify(selectedusers)}</span>
            <span class = 'createchat-submit-btn'><button class = 'basebutton' onClick={createchatproc}>Create Conversation</button></span>
        </div>
    </div>)
}