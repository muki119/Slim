import React from "react"
interface incomingMessage{
    keynum:number;
    message:string;
    sender?:string;
    position?:string
}
const IncomingMessage=({message,sender,position}:incomingMessage)=>{
    return <span className = {`incoming_message_${position!=="top"?"sandwich_":""}container`}>
                <span className ={`incoming_message${position?"_"+position:""}`}>
                    {message}
                </span>
                {sender&&
                    <span className ='sentby'>
                        {sender}
                    </span>
                }
            </span>}

export default React.memo(IncomingMessage)
