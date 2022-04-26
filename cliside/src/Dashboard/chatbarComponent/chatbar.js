import React from "react";

export default function ChatBar({setcc, displaycc, convomp}) {
    const dashdata = JSON.parse(localStorage.getItem('UD')) // login persistence data
    return (
    <div className='chatbar'>
        <div><span className='chatname'>{dashdata.user.firstname} {dashdata.user.surname}</span></div>
        <div className="chatbtnouter"><span className='create_chat_btn'><button onClick={() => {setcc(!displaycc);}}>Create chat</button></span></div>
        {convomp}
    </div>
    );
}
  
  