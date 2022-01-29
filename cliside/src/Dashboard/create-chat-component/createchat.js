import React, { useContext, useState ,useCallback, useEffect} from 'react';
import CreateChatContext from '../create-chat-component/c2context'
import {debounce, set}  from 'lodash';
import './createchat.css'
import axios from 'axios';


export default function CreateChat(){
    const {chats,displaycc,setcc,forceUpdate,socket,sets_cc} = useContext(CreateChatContext) 
    const dashdata = JSON.parse(localStorage.getItem('UD'))
    const [selectedusers,setselected] = useState([dashdata.user.username])// array of the users selected 
    const [foundusers , setfoundusers] =useState([])
    const [,setaui]=useState("")
   
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
        if (selectedusers.length === 1 && selectedusers.indexOf(dashdata.user.username) === 0  ){
           
        }else if (selectedusers.length >1 ){
            try{
                const createconv =await axios.post(`${process.env.REACT_APP_API_URL}/api/m/createconversation`,{users_involved :selectedusers})
                    var success = createconv.data.success 
                    if (success === true ){ // if the creation was successful 
                        chats.data.push(createconv.data.chat) // add data to chat array so it can be viewsd in the tiles 
                        socket.emit('join_rooms',createconv.data.chat.chat_id)
                        forceUpdate()
                        sets_cc(true) // successful conversation creation - this opens the snackbar 
                        setcc(false) // this closes the menu
                    }else if (createconv.success === false){
                    }
            }catch{
                
            }
        }
        
    }

    const mappedfoundusers = foundusers.map((value,index)=>{ // mapps all the users found from api call
        return<span class ='similarusrscard'key={index} id = {value.username}  tabindex={0} onClick={(e)=>{addtoselected(e)}}><span class='foundusrsfn'>{value.firstname}</span ><span class="foundusrsun">{value.username}</span></span>
    })
    
    const debcall =useCallback(debounce((e)=>{displaysimilarusers(e)},700),[setfoundusers,foundusers])
    
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