import React, { useState ,useCallback} from 'react';
import {debounce}  from 'lodash';
import './createchat.css'
import axios from 'axios';


export default function CreateChat({availableConversations,setchats,displaycc,setcc,socket,sets_cc,logoutProcess,setf_cc}){
    const dashdata = JSON.parse(localStorage.getItem('UD'))
    const [selectedusers,setselected] = useState([dashdata.user.username])// array of the users selected 
    const [foundusers , setfoundusers] =useState([])
    const [chatName ,setchatName] = useState(null)
   
    function closewindow(e){ // clickaway handler
        if (e.target.id === "dob"){
            setcc(!displaycc)
        }
    }
    async function displaysimilarusers(e){
        //setaui(e.target.value)
        if ((e.target.value).length >= 2 ){
            const similar =await axios.get(`${import.meta.env.VITE_APP_API_URL}/misc/getsimilar?q=${e.target.value}`) // gets all the simmilar users to the input //should be a get request
            setfoundusers(similar.data)
        }   
    }
    async function addtoselected(e){ // adds people to the array of the selected 
        var found_username = e.currentTarget.dataset.foundusername;
        var var2 = selectedusers.indexOf(found_username) 
        if (var2=== -1){ // if not already within the array 
           setselected([...selectedusers,found_username])  // add to array 
        }  
    }
    async function createchatproc(){ //sends to backend
        if (selectedusers.length >1 ){
            try{
                var uat = localStorage.getItem("Uat")
                const createconv =await axios.post(`${import.meta.env.VITE_APP_API_URL}/m/createconversation`,{chatName:chatName,users_involved :selectedusers,Uat:uat,username:dashdata.user.username}) // send to server and set response as variable 
                var success = createconv.data.success  
                if (createconv.data.validjwt === false){ // if token send alongside is invalid 
                    setcc(false) //stop rendering window
                    logoutProcess() //logout 
                }else{
                    if (success === true ){ // if the creation was successful 
                        setchats([...availableConversations,createconv.data.chat])
                        //availableConversations.push(createconv.data.chat) // add data to chat array so it can be viewsd in the tiles 
                        socket.emit('join_rooms',createconv.data.chat.chat_id)
                        //forceUpdate()
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
        var indexofuser = selectedusers.indexOf(e.currentTarget.dataset.selected_username)
        setselected([...selectedusers.slice(0,indexofuser),...selectedusers.slice(indexofuser+1)])
        //selectedusers.splice(indexofuser,1)
        //forceUpdate()
    }

    const mappedFoundUsers = foundusers.map((value,index)=>{ // mapps all the users found from api call
        return<span className ='similarusrscard'key={index} data-foundusername = {value.username}  tabIndex={0} onClick={(e)=>{addtoselected(e)}}><span className='foundusrsfn'>{value.firstname}</span ><span className="foundusrsun">{value.username}</span></span>
    })
    
    const mappedSelectedUsers = selectedusers.map((element)=>{ // displays the users u selected 
        if (element !== dashdata.user.username){
            return <span className ='selected_recipients' data-selected_username = {element} onClick={removeselected}>{element}</span>
        }   
    })
    const debcall =useCallback(debounce((e)=>{displaysimilarusers(e)},700),[setfoundusers,foundusers]) // debounces function so it only looks for users once user has stopped inputting for 700 ms +
    
    return(
        <div className ='dimopacitybackground'> 
            <span id = 'dob' onClick={(e)=>{closewindow(e)}}></span>
            <div className = "createchatformcontainer">
                <span className='add-userinput'><input placeholder='Input Group Chatname' onChange={e=>{setchatName(e.target.value)}}></input></span>
                <span className = 'add-userinput'><input placeholder='Input A Username' onChange={e=>{debcall(e)}}></input>{mappedFoundUsers}</span> 
                <span className = 'recipients_list '>
                    <p>Selected Recipients:</p>
                    {mappedSelectedUsers}
                </span>
                <span className = 'createchat-submit-btn'><button className = 'basebutton' onClick={createchatproc}>Create Conversation</button></span>
            </div>
        </div>
    )
}