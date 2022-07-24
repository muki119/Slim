import {ChatName,ListOfUsers} from "./chatname.js"
import { Avatar ,Tooltip, IconButton, Menu,MenuItem,ListItemIcon, Divider} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { useContext, useEffect, useState } from "react";
import axios from "axios";

export function AvailableConversationTiles ({index, conversation, chatchanger, chatName, usersinvolved, lastMessaged}){
    const [chatID,setId] = useState(null)
    
    const [openMenu,setOpenMenu] = useState(false)

    useEffect(()=>{
        setId(conversation.chat_id)
    },[])

    const changeTileMenuState =(e)=>{
        e.preventDefault()
        setOpenMenu(e.currentTarget);
    }

    return (
        <>
            <div key={index} data-chatid={conversation.chat_id} onClick={chatchanger} onContextMenu ={changeTileMenuState} tabIndex={0}>
                {chatName ? <ChatName {...{ chatName }} /> : <ListOfUsers {...{ usersinvolved }} />}{/*displays chatname if there is one - otherwide it  shows array of recipients */}
                <span className='last_messaged'>Last Messaged:{lastMessaged}</span>
            </div>
            <TileMenu {...{chatID,conversation,openMenu,setOpenMenu}}/>
        </>
    )
}


export function TileMenu({chatID,conversation,openMenu,setOpenMenu}){
    useEffect(()=>{ // set position === mouse x&y 

    },[])
    function leaveconversation(){
        ///asks are you sure 
        // then acts accordingly  -- this will be done with material ui 
    }
    async function addToConversation(){
        // calls and adds to conversation - may also use 
 
        try {
            const dataSchem = {
                username:username,
                userToAdd:usersToAdd, // restricting it to onl
                chatId:chatID  
            }
            const sendData = await axios.post(`${process.env.REACT_APP_API_URL}/m/addtoconversation`,null) 
            var success = sendData.data.
            if ()
        } catch (error) {
            
        }
        
    }
    // axios send request 
    // add person to chat 
    // leave chat 
    //change name might make that a function only 
    // on open set its position === to mouse x and y 

    return( // may use material ui for this one     
        <>
            <Menu id='Menu' anchorEl={openMenu} open={Boolean(openMenu)} onClose={(e) => { setOpenMenu(false); } } onClick={(e) => { setOpenMenu(false); } }>
                <MenuItem>
                    <ListItemIcon>
                        <PersonAddIcon className='lightanddarkicons' />
                    </ListItemIcon>
                    Add Person To Conversation
                </MenuItem>
                <Divider/>
                <MenuItem>
                    <ListItemIcon>
                        <PersonRemoveIcon className='lightanddarkicons' />
                    </ListItemIcon>
                    Leave Conversation
                </MenuItem>
            </Menu>
        </>
    )
}


export function FindPerson(){
    //menu that finds people 
    //check if person is in conversation 
    // if so display to side that theyre already in conversation and prevent them from being added 
    // allow person to select people 
    // copy looks and overall html from create-chat-component
    return(
        <>
        </>
    )
}