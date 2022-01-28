import React, { createContext,useContext, useEffect, useState ,useReducer,useCallback} from 'react';
import CreateChatContext from '../create-chat-component/c2context'
import Axios from 'axios'
import anime, { easings } from 'animejs'
import {debounce}  from 'lodash';
import './createchat.css'
import axios from 'axios';
import $ from "jquery"

export default function CreateChat(){
    const {chats,setchats,displaycc,setcc} = useContext(CreateChatContext) 
    const [selectedusers,setselected] = useState([])// array of the users selected 
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
            console.log(foundusers)
            setfoundusers(similar.data)
        }
        
    }
    async function addtoselected(e){
        setselected([...selectedusers,e.currentTarget.id])
    }

    const mappedfoundusers = foundusers.map((value,index)=>{ // mapps all the users found from api call
        console.log(value);
        return<span class ='similarusrscard'key={index} id = {value.username} onClick={(e)=>{addtoselected(e)}}><span class='foundusrsfn'>{value.firstname}</span ><span class="foundusrsun">{value.username}</span></span>
    })
    
    const debcall =useCallback(debounce((e)=>{displaysimilarusers(e)},700),[adduserinput])
    
    return(
    
    <div class ='dimopacitybackground'> 
        <background id = 'dob' onClick={(e)=>{closewindow(e)}}></background>
        <div class = "createchatformcontainer">
            <span class = 'add-userinput'><input placeholder='Input A Username' onChange={e=>{debcall(e)}}></input></span> 
            <span class = 'add-tolist-btn '><button class = 'basebutton'>Add to chat recipients</button></span>
            <span class = 'recipiennts-list '>{JSON.stringify(selectedusers)}{mappedfoundusers}</span>
            <span class = 'createchat-submit-btn'><button class = 'basebutton'>Create Conversation</button></span>
        </div>
    </div>)
}