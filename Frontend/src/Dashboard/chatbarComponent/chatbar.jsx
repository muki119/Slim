import { IconButton, Tooltip } from "@mui/material";
import CreateIcon from '@mui/icons-material/Create';
import React from "react";

export default function ChatBar({setcc, displaycc, convomp}) {
    const dashdata = JSON.parse(localStorage.getItem('UD')) // login persistence data
    const MemoizedIconButton = React.memo(IconButton)
    const MemoizedTooltip = React.memo(Tooltip)
    return (
    <div className='chatbar'>
        <div className="usersnameCreatechatbutton">
            <span className='chatname'>{dashdata.user.firstname} {dashdata.user.surname}</span>
            <div className="chatbtnouter">
                <span className='create_chat_btn'>
                    <MemoizedTooltip title={"Create a new conversation"}>
                        <MemoizedIconButton disableRipple={true} onClick={() => {setcc(!displaycc);}}>
                            <CreateIcon/>
                        </MemoizedIconButton>
                    </MemoizedTooltip>
                    
                </span>
            </div>
        </div>
        
        {convomp}{/*Mapped conversation*/ }
    </div>
    );
}
  
  