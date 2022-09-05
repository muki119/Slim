import {ChatName,ListOfUsers} from "./chatname.js"
import { Menu,MenuItem,ListItemIcon, Divider ,TextField, Dialog, DialogTitle, DialogContent, DialogActions, Button} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { useState } from "react";
import axios from "axios";
import './AvailableConversationIcon.css'
export function AvailableConversationTiles ({index, conversation, chatchanger, chatName, usersinvolved, lastMessaged,chats,forceUpdate}){
    const [chatID,] = useState(conversation.chat_id)
    const [openMenu,setOpenMenu] = useState(false)
    const [openFindpersonMenu ,setoFPM]= useState(false)
    const [openConfirmatiion,setopenConfirmation]=useState(false)

    const changeTileMenuState =(e)=>{
        e.preventDefault()
        setOpenMenu(e.currentTarget);
    }

    return (
        <>
            <div key={index} data-chatid={conversation.chat_id} onClick={chatchanger} onContextMenu ={changeTileMenuState} tabIndex={0}>
                {chatName ? <ChatName {...{ chatName }} /> : <ListOfUsers {...{ usersinvolved }} />}{/*displays chatname if there is one - otherwide it  shows array of recipients */}
                <span className='last_messaged'>{lastMessaged}</span>
            </div>

            <TileMenu {...{chatID,conversation,openMenu,setOpenMenu,openFindpersonMenu,setoFPM,setopenConfirmation}}/>{/* The menu with the option to delete or add person to conversation*/}
            <FindPerson {...{openFindpersonMenu,setoFPM,setopenConfirmation}}/>
            <LeaveConfirmation {...{openConfirmatiion,setopenConfirmation,chatID,chats,forceUpdate}}/>

        </>
    )
}


export function TileMenu({openMenu,setOpenMenu,setoFPM,setopenConfirmation}){

    return( // may use material ui for this one     
        <>
            <Menu id='Menu' anchorEl={openMenu} open={Boolean(openMenu)} onClose={(e) => { setOpenMenu(false); } } onClick={(e) => { setOpenMenu(false); } } anchorOrigin={{vertical: 'center',horizontal: 'center'}} >
                <MenuItem onClick={()=>{setoFPM(true)}}>
                    <ListItemIcon>
                        <PersonAddIcon className='lightanddarkicons' />
                    </ListItemIcon>
                    Add Person To Conversation
                </MenuItem>
                <Divider/>
                <MenuItem onClick={()=>{setopenConfirmation(true)}}>
                    <ListItemIcon>
                        <PersonRemoveIcon className='lightanddarkicons' />
                    </ListItemIcon>
                    Leave Conversation
                </MenuItem>
            </Menu>
        </>
    )
}


export function FindPerson({openFindpersonMenu,setoFPM}){
    //menu that finds people 
    //check if person is in conversation 
    // if so display to side that theyre already in conversation and prevent them from being added 
    // allow person to select people 
    // copy looks and overall html from create-chat-component
    return(
        <>
            <Dialog className ="Tootalo" open={openFindpersonMenu} onClose={()=>{setoFPM(false)}} fullWidth={true} maxWidth={"sm"} >
                <DialogTitle>Select A Person To Add</DialogTitle>
                <DialogContent>
                    <TextField label="Input a Username" variant="standard" margin="dense" />
                </DialogContent>
                <DialogContent>
                    yerr
                </DialogContent>
            </Dialog>
        </>
    )
}

function LeaveConfirmation({openConfirmatiion,setopenConfirmation,chatID,chats,forceUpdate}){
    const dashdata = JSON.parse(localStorage.getItem('UD'))
    async function HandleAcceptance (){
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/m/leave-conversation`,{username:dashdata.user.username,chatId:chatID}) // sends request to delete the chat 
            chats.data = chats.data.filter(e=>e.chat_id!==chatID)
            setopenConfirmation(false) 
            forceUpdate()            
        } catch (error) {
            setopenConfirmation(false) 
        }
        
    }
    
    return(
        <>
            <Dialog open={openConfirmatiion} onClose={()=>{setopenConfirmation(false)}}fullWidth={true} maxWidth={"sm"} >
                <DialogTitle>
                    Are You Sure?
                </DialogTitle>
                <DialogActions>
                    <Button className="Okbutton" onClick={HandleAcceptance}>Ok</Button>
                    <Button className="CancelButton"variant="outlined" color="error" onClick={()=>{setopenConfirmation(false)}}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}