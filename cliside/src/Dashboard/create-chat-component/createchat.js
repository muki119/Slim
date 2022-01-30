import React, { useContext, useState ,useCallback} from 'react';
import CreateChatContext from '../create-chat-component/c2context'
import {debounce}  from 'lodash';
import './createchat.css'
import axios from 'axios';


export default function CreateChat(){
    const {chats,displaycc,setcc,forceUpdate,socket,sets_cc,logoutproc,setf_cc} = useContext(CreateChatContext) 
    const dashdata = JSON.parse(localStorage.getItem('UD'))
    const [selectedusers,setselected] = useState([dashdata.user.username])// array of the users selected 
    const [foundusers , setfoundusers] =useState([])
    const [,setaui]=useState("")
   
    function closewindow(e){ // clickaway handler
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
        var var2 = selectedusers.indexOf(e.target.dataset.foundusername) 
        if (var2=== -1){
           setselected([...selectedusers,e.target.dataset.foundusername]) 
        }  
    }
    async function createchatproc(){ //sends to backend
        if (selectedusers.length >1 ){
            try{
                var uat = localStorage.getItem("Uat")
                const createconv =await axios.post(`${process.env.REACT_APP_API_URL}/api/m/createconversation`,{users_involved :selectedusers,Uat:uat,username:dashdata.user.username})
                var success = createconv.data.success 
                if (createconv.data.validjwt === false){
                    setcc(false)
                    logoutproc()
                }else{
                    if (success === true ){ // if the creation was successful 
                        chats.data.push(createconv.data.chat) // add data to chat array so it can be viewsd in the tiles 
                        socket.emit('join_rooms',createconv.data.chat.chat_id)
                        forceUpdate()
                        sets_cc(true) // successful conversation creation - this opens the snackbar 
                        setcc(false) // this closes the menu
                    }else if (createconv.success === false){ // if the creation was a failiure 
                        setf_cc(true) // failed create conversation state 
                        setcc(false) // closes the menu
                    }
                }
                
            }catch{
                setf_cc(true) // failed create conversation state 
                setcc(false) // closes the menu  
            }
        }
        
    }

    function removeselected (e){
        var indexofuser = selectedusers.indexOf(e.target.dataset.selected_username)
        selectedusers.splice(indexofuser,1)
        forceUpdate()
    }

    const mappedfoundusers = foundusers.map((value,index)=>{ // mapps all the users found from api call
        return<span class ='similarusrscard'key={index} data-foundusername = {value.username}  tabindex={0} onClick={(e)=>{addtoselected(e)}}><span class='foundusrsfn'>{value.firstname}</span ><span class="foundusrsun">{value.username}</span></span>
    })
    
    const mappedselectedusers = selectedusers.map((element,index)=>{
        if (element !== dashdata.user.username){
            return <span  key = {index+12} class ='selected_recipients' data-selected_username = {element} onClick={removeselected}>{element}</span>
        }
        
    })
    const debcall =useCallback(debounce((e)=>{displaysimilarusers(e)},700),[setfoundusers,foundusers])
    
    return(
    
    <div class ='dimopacitybackground'> 
        <span id = 'dob' onClick={(e)=>{closewindow(e)}}></span>
        <div class = "createchatformcontainer">
            <span class = 'add-userinput'><input placeholder='Input A Username' onChange={e=>{debcall(e)}}></input>{mappedfoundusers}</span> 
            <span class = 'recipients_list '>
                <p>Selected Recipients:</p>
                {mappedselectedusers}
            </span>
            <span class = 'createchat-submit-btn'><button class = 'basebutton' onClick={createchatproc}>Create Conversation</button></span>
        </div>
    </div>)
}